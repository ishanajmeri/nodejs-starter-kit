import React, { useEffect } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';

import { compose } from '@gqlapp/core-common';
import { translate } from '@gqlapp/i18n-client-react';

import { withDiscounts } from './DiscountOperations';
import DiscountsCarouselView from '../components/DiscountsCarouselView';
import { subscribeToDiscounts } from './DiscountSubscriptions';

// types
import { FilterDiscountInput } from '../../../../packages/server/__generated__/globalTypes';
import { discounts_discounts as DiscountsEdge } from '../graphql/__generated__/discounts';

export interface DiscountsCarouselProps {
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
  loading: boolean;
  filter: FilterDiscountInput;
  title: string;
  discounts: DiscountsEdge;
  style?: object;
}

const DiscountsCarousel: React.FunctionComponent<DiscountsCarouselProps> = props => {
  const { subscribeToMore, loading, discounts, title, filter } = props;
  useEffect(() => {
    const subscribe = subscribeToDiscounts(subscribeToMore, filter);
    return () => subscribe();
  });
  const ids = (discounts && discounts.totalCount > 0 && discounts.edges.map(d => d.node.modalId)) || [];

  // console.log('props', props);
  return loading ? null : <DiscountsCarouselView title={title} ids={ids} {...props} />;
};

export default compose(withDiscounts, translate('discount'))(DiscountsCarousel);
