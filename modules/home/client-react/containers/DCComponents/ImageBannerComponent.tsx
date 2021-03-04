import React from 'react';

import { translate } from '@gqlapp/i18n-client-react';
import { compose } from '@gqlapp/core-common';
import { Spinner } from '@gqlapp/look-client-react';

import { withDynamicCarousels } from './DynamicCarouselOperations';
import ImageBannerComponentView from '../../components/DCComponents/ImageBannerComponentView';
// types
import { dynamicCarousels_dynamicCarousels as DynamicCarousels } from '../../graphql/__generated__/dynamicCarousels';
interface ImageBannerComponentProps {
  loading: boolean;
  dynamicCarousels: DynamicCarousels;
}

const ImageBannerComponent: React.FunctionComponent<ImageBannerComponentProps> = props => {
  const { loading, dynamicCarousels } = props;

  // console.log('props', props);
  return !loading && dynamicCarousels ? (
    <ImageBannerComponentView {...props} id="Banner1_0" key="Banner1_0" data={dynamicCarousels} />
  ) : (
    <Spinner size="small" />
  );
};

export default compose(withDynamicCarousels, translate('home'))(ImageBannerComponent);
