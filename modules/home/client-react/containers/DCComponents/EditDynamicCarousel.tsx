import React, { useEffect } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { History } from 'history';

import { compose } from '@gqlapp/core-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

import { withDynamicCarousel, withEditDynamicCarousel, subscribeToDynamicCarousel } from './DynamicCarouselOperations';
import EditDynamicCarouselView from '../../components/DCComponents/EditDynamicCarouselView.web';
// types
import { EditDynamicCarouselInput } from '../../../../../packages/server/__generated__/globalTypes';
import { dynamicCarousel_dynamicCarousel as DynamicCarousel } from '../../graphql/__generated__/dynamicCarousel';

export interface EditDynamicCarouselProps {
  t: TranslateFunction;
  loading: boolean;
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
  history: History;
  editDynamicCarousel: (values: EditDynamicCarouselInput) => void;
  dynamicCarousel: DynamicCarousel;
}

const EditDynamicCarousel: React.FunctionComponent<EditDynamicCarouselProps> = props => {
  const { subscribeToMore, history, editDynamicCarousel } = props;
  useEffect(() => {
    const subscribe = subscribeToDynamicCarousel(subscribeToMore, history);
    return () => subscribe();
  });
  const handleSubmit = (values: EditDynamicCarouselInput) => {
    try {
      editDynamicCarousel(values);
    } catch (e) {
      throw Error(e);
    }
  };
  // console.log('props', props);
  return <EditDynamicCarouselView onSubmit={handleSubmit} {...props} />;
};

export default compose(withDynamicCarousel, withEditDynamicCarousel, translate('home'))(EditDynamicCarousel);
