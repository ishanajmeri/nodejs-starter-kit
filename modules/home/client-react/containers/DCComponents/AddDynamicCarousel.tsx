import React from 'react';

import { compose } from '@gqlapp/core-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

import AddDynamicCarouselView from '../../components/DCComponents/AddDynamicCarouselView.web';
import { withAddDynamicCarousel } from './DynamicCarouselOperations';
// types
import { EditDynamicCarouselInput } from '../../../../../packages/server/__generated__/globalTypes';

export interface AddDynamicCarouselProps {
  t: TranslateFunction;
  loading: boolean;
  addDynamicCarousel: (values: EditDynamicCarouselInput) => void;
}

const AddDynamicCarousel: React.FunctionComponent<AddDynamicCarouselProps> = props => {
  const { addDynamicCarousel } = props;
  const handleSubmit = (values: EditDynamicCarouselInput) => {
    try {
      delete values.id;
      addDynamicCarousel(values);
    } catch (e) {
      throw Error(e);
    }
  };
  return <AddDynamicCarouselView onSubmit={handleSubmit} {...props} />;
};
export default compose(withAddDynamicCarousel, translate('home'))(AddDynamicCarousel);
