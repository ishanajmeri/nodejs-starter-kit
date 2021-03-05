import React from 'react';
import { graphql } from 'react-apollo';
import { pick } from 'lodash';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { History } from 'history';
import { match as Match } from 'react-router-dom';

import { compose } from '@gqlapp/core-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';
import settings from '@gqlapp/config';

import UserEditView from '../components/UserEditView.web';
import UserFormatter from '../helpers/UserFormatter';

import USER_QUERY from '../graphql/UserQuery.graphql';
import EDIT_USER from '../graphql/EditUser.graphql';
// types
import { EditUserInput } from '../../../../packages/server/__generated__/globalTypes';
import { userVariables, user_user_user as User, user as usersResponse } from '../graphql/__generated__/user';
import { editUserVariables, editUser as editUserResponse } from '../graphql/__generated__/editUser';

export interface UserEditProps {
  t: TranslateFunction;
  history: History;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  editUser: (values: EditUserInput) => void;
  user: User;
}

const UserEdit: React.FunctionComponent<UserEditProps> = props => {
  const { user, editUser, t, history, navigation } = props;

  const onSubmit = async (values: EditUserInput) => {
    let userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    userValues.profile = pick(values.profile, ['firstName', 'lastName', 'avatar']);

    userValues = UserFormatter.trimExtraSpaces(userValues);

    if (settings.auth.certificate.enabled) {
      userValues.auth = { certificate: pick(values.auth.certificate, 'serial') };
    }

    try {
      await editUser({ id: user.id, ...userValues });
    } catch (e) {
      throw new FormError(t('userEdit.errorMsg'), e);
    }

    if (history) {
      return history.goBack();
    }

    if (navigation) {
      return navigation.goBack();
    }
  };

  return <UserEditView onSubmit={onSubmit} {...props} />;
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
    props({ data: { loading, user } }) {
      const userPayload = user ? { user: user.user } : {};
      return {
        loading,
        ...userPayload
      };
    }
  }),
  graphql<{}, editUserResponse, editUserVariables, {}>(EDIT_USER, {
    props: ({ mutate }) => ({
      editUser: async (input: UserEditView) => {
        const {
          data: { editUser }
        } = await mutate({
          variables: { input }
        });

        return editUser;
      }
    })
  }),
  translate('user')
)(UserEdit);
