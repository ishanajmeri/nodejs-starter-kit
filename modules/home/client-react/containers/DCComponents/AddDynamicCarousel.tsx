import React from 'react';

import { compose } from '@gqlapp/core-common';
import { translate } from '@gqlapp/i18n-client-react';

import AddDynamicCarouselView from '../../components/DCComponents/AddDynamicCarouselView.web';
import { withAddDynamicCarousel } from './DynamicCarouselOperations';
// types
import { AddDynamicCarouselInput } from '../../../../../packages/server/__generated__/globalTypes';

export interface AddDynamicCarouselProps {
  addDynamicCarousel: (values: AddDynamicCarouselInput) => void;
}

const AddDynamicCarousel: React.FunctionComponent<AddDynamicCarouselProps> = props => {
  const { addDynamicCarousel } = props;
  const handleSubmit = (values: AddDynamicCarouselInput) => {
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
