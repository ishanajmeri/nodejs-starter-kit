import React, { useEffect, useState } from 'react';
import { graphql, withApollo } from 'react-apollo';
import queryString from 'query-string';
import { History } from 'history';
import { ApolloClient } from 'apollo-client';

import { compose } from '@gqlapp/core-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';
import authentication from '@gqlapp/authentication-client-react';

import ROUTES from '../routes';
import LoginView from '../components/LoginView.web';
import LOGIN from '../graphql/Login.graphql';
// types
import { loginVariables, login as loginResponse } from '../graphql/__generated__/login';
import { LoginUserInput } from '../../../../packages/server/__generated__/globalTypes';

interface LoginProps {
  t: TranslateFunction;
  history: History;
  location: Location;
  login: (values: LoginUserInput) => void;
  client: ApolloClient<any>;
}

const Login: React.FunctionComponent<LoginProps> = props => {
  const { t, login, client, history, location } = props;
  const {
    location: { search }
  } = props.history;

  const [isRegistered, setIsRegistered] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (search.includes('email-verified')) {
      setIsRegistered(true);
    }
    setIsReady(true);
  }, [search]);

  const hideModal = () => {
    setIsRegistered(false);
    history.push({ search: '' });
  };

  const onSubmit = async (values: LoginUserInput) => {
    try {
      await login(values);
    } catch (e) {
      throw new FormError(t('login.errorMsg'), e);
    }

    await authentication.doLogin(client);

    const params = queryString.parse(location.search);
    history.push(params.redirectBack ? params.redirectBack.toString() : `${ROUTES.profile}`);
  };

  return (
    <React.Fragment>
      {isReady && <LoginView {...props} isRegistered={isRegistered} hideModal={hideModal} onSubmit={onSubmit} />}
    </React.Fragment>
  );
};

const LoginWithApollo = compose(
  withApollo,
  graphql<{}, loginResponse, loginVariables, {}>(LOGIN, {
    props: ({ mutate }) => ({
      login: async ({ usernameOrEmail, password }: { usernameOrEmail: string; password: string }) => {
        const {
          data: { login }
        } = await mutate({
          variables: { input: { usernameOrEmail, password } }
        });
        return login;
      }
    })
  }),
  translate('user')
)(Login);

export default LoginWithApollo;
