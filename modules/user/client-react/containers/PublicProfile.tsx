import React from 'react';
import { graphql } from 'react-apollo';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { match as Match } from 'react-router-dom';

import { Spin as Loader } from '@gqlapp/look-client-react';
import { compose } from '@gqlapp/core-common';
import USER_QUERY from '@gqlapp/user-client-react/graphql/UserQuery.graphql';

import PublicProfileView from '../components/PublicProfileView.web';
// types
import { userVariables, user as usersResponse } from '../graphql/__generated__/user';

interface PublicProfileProps {
  userloading: boolean;
}

const PublicProfile: React.FunctionComponent<PublicProfileProps> = props => {
  return <>{props.userloading ? <Loader /> : <PublicProfileView {...props} />}</>;
};

export default compose(
  graphql<
    {
      match: Match<{ id: string }>;
      navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    },
    usersResponse,
    userVariables,
    {}
  >(USER_QUERY, {
    options: props => {
      let id = '0';
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }
      return {
        variables: { id: Number(id) }
      };
    },
    props({ data: { loading, user, refetch } }) {
      return {
        userloading: loading,
        user,
        refetch
      };
    }
  })
)(PublicProfile);
