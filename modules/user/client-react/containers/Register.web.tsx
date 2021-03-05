import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import { History } from 'history';

import { compose } from '@gqlapp/core-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';
import settings from '@gqlapp/config';
import ROUTES from '../routes';

import RegisterView from '../components/RegisterView.web';
import REGISTER from '../graphql/Register.graphql';
// types
import { RegisterUserInput } from '../../../../packages/server/__generated__/globalTypes';
import { registerVariables, register as registerResponse } from '../graphql/__generated__/register';

interface RegisterProps {
  t: TranslateFunction;
  history: History;
  register: (values: RegisterUserInput) => void;
}

const Register: React.FunctionComponent<RegisterProps> = props => {
  const { t, register, history } = props;

  const [isRegistered, setIsRegistered] = useState(false);

  const onSubmit = async (values: RegisterUserInput) => {
    try {
      await register(values);
      if (!settings.auth.password.requireEmailConfirmation) {
        history.push(`${ROUTES.login}`);
      } else {
        setIsRegistered(true);
      }
    } catch (e) {
      throw new FormError(t('reg.errorMsg'), e);
    }
  };

  return <RegisterView {...props} isRegistered={isRegistered} onSubmit={onSubmit} />;
};

const RegisterWithApollo = compose(
  graphql<{}, registerResponse, registerVariables, {}>(REGISTER, {
    props: ({ mutate }) => ({
      register: async ({ username, email, password }: { username: string; email: string; password: string }) => {
        const {
          data: { register }
        } = await mutate({ variables: { input: { username, email, password } } });
        return register;
      }
    })
  }),
  translate('user')
)(Register);
export default RegisterWithApollo;
