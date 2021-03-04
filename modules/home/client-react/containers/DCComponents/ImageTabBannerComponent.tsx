import React from 'react';

import { translate } from '@gqlapp/i18n-client-react';
import { compose } from '@gqlapp/core-common';

import { withDynamicCarousels } from './DynamicCarouselOperations';
import ImageTabBannerComponentView from '../../components/DCComponents/ImageTabBannerComponentView';
// types
import { dynamicCarousels_dynamicCarousels as DynamicCarousels } from '../../graphql/__generated__/dynamicCarousels';

interface ImageTabBannerComponentProps {
  loading: boolean;
  dynamicCarousels: DynamicCarousels;
}

const ImageTabBannerComponent: React.FunctionComponent<ImageTabBannerComponentProps> = props => {
  const { loading, dynamicCarousels } = props;

  return !loading && dynamicCarousels ? (
    <ImageTabBannerComponentView {...props} id="Banner1_0" key="Banner1_0" data={dynamicCarousels} />
  ) : null;
};

export default compose(withDynamicCarousels, translate('home'))(ImageTabBannerComponent);
