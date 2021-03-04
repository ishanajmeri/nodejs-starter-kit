import React from 'react';

import { translate } from '@gqlapp/i18n-client-react';
import { compose } from '@gqlapp/core-common';
import { Spinner } from '@gqlapp/look-client-react';

import { withDynamicCarousels } from './DynamicCarouselOperations';
import DynamicCarouselComponentView from '../../components/DCComponents/DynamicCarouselComponentView';
// types
import { dynamicCarousels_dynamicCarousels as DynamicCarousels } from '../../graphql/__generated__/dynamicCarousels';

interface DynamicCarouselComponentProps {
  loading: boolean;
  dynamicCarousels: DynamicCarousels;
}

const DynamicCarouselComponent: React.FunctionComponent<DynamicCarouselComponentProps> = props => {
  const { loading, dynamicCarousels } = props;

  // console.log('props', props);
  return !loading && dynamicCarousels ? (
    <DynamicCarouselComponentView {...props} id="Banner1_0" key="Banner1_0" data={dynamicCarousels} />
  ) : (
    <div style={{ height: '100vh' }}>
      <Spinner />
    </div>
  );
};

export default compose(withDynamicCarousels, translate('home'))(DynamicCarouselComponent);
