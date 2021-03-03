import React from 'react';

import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { PageLayout, MetaTags, Heading, Row, Card, Spinner } from '@gqlapp/look-client-react';

import ReviewFormComponent from './ReviewFormComponent';

// types
import { review_review as Review } from '../graphql/__generated__/review';
import { EditReviewInput } from '../../../../packages/server/__generated__/globalTypes';
import { currentUser_currentUser } from '@gqlapp/user-client-react/graphql/__generated__/currentUser';

export interface EditReviewViewProps {
  t: TranslateFunction;
  review: Review;
  onSubmit: (values: EditReviewInput) => void;
  currentUser: currentUser_currentUser;
}

const EditReviewView: React.FunctionComponent<EditReviewViewProps> = props => {
  const { review, onSubmit, currentUser, t } = props;
  return (
    <PageLayout type="forms">
      <MetaTags title={t('title')} description={t('meta')} />
      <br />
      <br />
      <br />
      <Row type="flex" justify="center">
        {review ? (
          <Card
            title={
              <Heading type="1">
                <strong>{t('editReview')}</strong>
              </Heading>
            }
          >
            <ReviewFormComponent t={t} review={review} onSubmit={onSubmit} showModal={false} />
          </Card>
        ) : (
          <Spinner size="small" />
        )}
      </Row>
    </PageLayout>
  );
};

export default EditReviewView;
