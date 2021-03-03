import React, { useEffect } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';

import { compose } from '@gqlapp/core-common';
import { translate } from '@gqlapp/i18n-client-react';

import { withReviews, withReviewsDeleting, subscribeToReviews } from './ReviewOperations';
// types
import { FilterReviewInput } from './../../../../packages/server/__generated__/globalTypes';

interface ReviewContainerProps {
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
  filter: FilterReviewInput;
  children: JSX.Element;
}

const ReviewContainer: React.FunctionComponent<ReviewContainerProps> = props => {
  const { subscribeToMore, filter } = props;

  useEffect(() => {
    const subscribe = subscribeToReviews(subscribeToMore, filter);
    return () => subscribe();
  });
  return React.cloneElement(props.children, { ...props });
};

export default compose(withReviews, withReviewsDeleting, translate('review'))(ReviewContainer);
