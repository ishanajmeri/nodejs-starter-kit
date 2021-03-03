import React from 'react';

import { compose } from '@gqlapp/core-common';
import { PageLayout } from '@gqlapp/look-client-react';
import { withCurrentUser } from '@gqlapp/user-client-react/containers/UserOperations';

import MyReviewView from '../components/MyReviewView';
import MyReviewContainer from './MyReviewContainer';
import { currentUser_currentUser as CurrentUser } from '@gqlapp/user-client-react/graphql/__generated__/currentUser';

interface MyReviewProps {
  currentUser: CurrentUser;
}

const MyReview: React.FunctionComponent<MyReviewProps> = props => {
  const [modalName, setModalName] = React.useState('');
  const { currentUser } = props;
  return (
    <PageLayout>
      <MyReviewContainer
        filter={{ isActive: true, userId: currentUser && currentUser.id, modalName }}
        setModalName={setModalName}
        modalName={modalName}
        {...props}
      >
        <MyReviewView />
      </MyReviewContainer>
    </PageLayout>
  );
};

export default compose(withCurrentUser)(MyReview);
