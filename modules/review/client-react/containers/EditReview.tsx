import React, { useEffect } from 'react';
import { Message } from '@gqlapp/look-client-react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { History } from 'history';

import { compose, removeTypename } from '@gqlapp/core-common';
import { translate } from '@gqlapp/i18n-client-react';

import { withReview, withReviewEditing, subscribeToReview } from './ReviewOperations';

import EditReviewView from '../components/EditReviewView.web';
import ROUTES from '../routes';
// types
import { EditReviewInput } from '../../../../packages/server/__generated__/globalTypes';
import { EditReviewViewProps } from '../components/EditReviewView.web';

interface EditReviewProps extends EditReviewViewProps {
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
  history: History;
  editReview: (values: EditReviewInput) => void;
}

const EditReview: React.FunctionComponent<EditReviewProps> = props => {
  const { subscribeToMore, history } = props;

  useEffect(() => {
    const subscribe = subscribeToReview(subscribeToMore, history);
    return () => subscribe();
  });

  const onSubmit = async (values: EditReviewInput) => {
    Message.destroy();
    Message.loading('Please wait...', 0);
    try {
      values = { ...removeTypename(values), id: null };
      const input = {
        id: values.id,
        userId: values.userId,
        rating: values.rating,
        feedback: values.feedback,
        isActive: values.isActive,
        reviewMedia: Object.values(values.reviewMedia)
      };
      await props.editReview(input);
    } catch (e) {
      Message.destroy();
      Message.error("Couldn't perform the action");
      console.error(e);
    }
    Message.destroy();
    Message.success('Changes Saved.');
    if (props.history) {
      return props.history.push(ROUTES.adminPanel);
    }
    // if (navigation) {
    //   if (role === 'admin') return navigation.navigate('ListingCatalogue');
    //   else return navigation.navigate('MyReviews');
    // }
  };
  // console.log('props', props);
  return <EditReviewView {...props} onSubmit={onSubmit} />;
};

export default compose(withReview, withReviewEditing, translate('review'))(EditReview);
