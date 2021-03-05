import React from 'react';
import { graphql } from 'react-apollo';
import { match as Match } from 'react-router-dom';
import { History } from 'history';

import { compose } from '@gqlapp/core-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';
import ROUTES from '../routes';

import ResetPasswordView from '../components/ResetPasswordView.web';

import RESET_PASSWORD from '../graphql/ResetPassword.graphql';
// types
import { ResetPasswordInput } from '../../../../packages/server/__generated__/globalTypes';
import { resetPasswordVariables, resetPassword as resetPasswordResponse } from '../graphql/__generated__/resetPassword';

interface ResetPasswordProps {
  t: TranslateFunction;
  history: History;
  match: Match<{ token: string }>;
  resetPassword: (values: ResetPasswordInput) => void;
}

const ResetPassword: React.FunctionComponent<ResetPasswordProps> = props => {
  const { t, resetPassword, history, match } = props;

  const onSubmit = async (values: ResetPasswordInput) => {
    try {
      await resetPassword({ ...values, token: match.params.token });
    } catch (e) {
      throw new FormError(t('resetPass.errorMsg'), e);
    }
    history.push(`${ROUTES.login}`);
  };

  return <ResetPasswordView {...props} onSubmit={onSubmit} />;
};

const ResetPasswordWithApollo = compose(
  graphql<{}, resetPasswordResponse, resetPasswordVariables, {}>(RESET_PASSWORD, {
    props: ({ mutate }) => ({
      resetPassword: async ({
        password,
        passwordConfirmation,
        token
      }: {
        password: string;
        passwordConfirmation: string;
        token: string;
      }) => {
        const {
          data: { resetPassword }
        } = await mutate({
          variables: { input: { password, passwordConfirmation, token } }
        });
        return resetPassword;
      }
    })
  }),
  translate('user')
)(ResetPassword);

export default ResetPasswordWithApollo;
