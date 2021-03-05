import React from 'react';
import { graphql } from 'react-apollo';
import { pick } from 'lodash';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { History } from 'history';

import { compose } from '@gqlapp/core-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';
import settings from '@gqlapp/config';
import ROUTES from '../routes';

import UserAddView from '../components/UserAddView.web';
import ADD_USER from '../graphql/AddUser.graphql';
import UserFormatter from '../helpers/UserFormatter';
// types
import { EditUserInput } from '../../../../packages/server/__generated__/globalTypes';

interface UserAddProps {
  t: TranslateFunction;
  history: History;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  addUser: (values: EditUserInput) => void;
}

const UserAdd: React.FunctionComponent<UserAddProps> = props => {
  const { addUser, t, history, navigation } = props;

  const onSubmit = async (values: EditUserInput) => {
    let userValues = pick(values, ['username', 'email', 'role', 'isActive', 'password', 'id', 'profile', 'auth']);

    userValues.profile = pick(values.profile, ['firstName', 'lastName']);

    userValues = UserFormatter.trimExtraSpaces(userValues);

    if (settings.auth.certificate.enabled) {
      userValues.auth = { certificate: pick(values.auth.certificate, 'serial') };
    }
    delete userValues.id;
    try {
      await addUser(userValues);
    } catch (e) {
      throw new FormError(t('userAdd.errorMsg'), e);
    }

    if (history) {
      return history.push(`${ROUTES.adminPanel}`);
    }
    if (navigation) {
      return navigation.goBack();
    }
  };

  return <UserAddView onSubmit={onSubmit} {...props} />;
};

export default compose(
  graphql(ADD_USER, {
    props: ({ mutate }) => ({
      addUser: async (input: EditUserInput) => {
        const { data: addUser } = await mutate({
          variables: { input }
        });
        return addUser;
      }
    })
  }),
  translate('user')
)(UserAdd);
