import React from 'react';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';
import { Avatar, Icon } from '@gqlapp/look-client-react';

import CURRENT_USER_AVATAR_QUERY from '../graphql/CurrentUserQuery.graphql';
// types
import {
  currentUser_currentUser as CurrentUser,
  currentUser as currentUserResponse
} from '../graphql/__generated__/currentUser';

interface UserAvatarProps {
  currentUser: CurrentUser;
  currentUserLoading: boolean;
  size: string;
  shape: string;
}

const UserAvatar: React.FunctionComponent<UserAvatarProps> = props => {
  const profile = !props.currentUserLoading && props.currentUser && props.currentUser.profile;

  return (
    <Avatar size={props.size} shape={props.shape} src={profile && profile.avatar} icon={<Icon type="UserOutlined" />} />
  );
};

export default compose(
  graphql<{}, currentUserResponse, {}, {}>(CURRENT_USER_AVATAR_QUERY, {
    props({ data: { loading, error, currentUser } }) {
      if (error) {
        throw new Error(error.message);
      }
      return { currentUserLoading: loading, currentUser };
    }
  })
)(UserAvatar);
