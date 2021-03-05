import React, { useState } from 'react';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';
import { TranslateFunction, translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';

import ForgotPasswordView from '../components/ForgotPasswordView.web';

import FORGOT_PASSWORD from '../graphql/ForgotPassword.graphql';
// types
import { ForgotPasswordInput } from '../../../../packages/server/__generated__/globalTypes';
import {
  forgotPasswordVariables,
  forgotPassword as forgotPasswordResponse
} from '../graphql/__generated__/forgotPassword';

interface ForgotPasswordProps {
  t: TranslateFunction;
  forgotPassword: (values: ForgotPasswordInput) => void;
}

const ForgotPassword: React.FunctionComponent<ForgotPasswordProps> = props => {
  const { forgotPassword, t } = props;
  const [sent, setSent] = useState(false);

  const onSubmit = async (values: ForgotPasswordInput) => {
    setSent(true);
    try {
      await forgotPassword(values);
    } catch (e) {
      throw new FormError(t('forgotPass.errorMsg'), e);
    }
  };
  return <ForgotPasswordView {...props} sent={sent} onSubmit={onSubmit} />;
};

const ForgotPasswordWithApollo = compose(
  graphql<{}, forgotPasswordResponse, forgotPasswordVariables, {}>(FORGOT_PASSWORD, {
    props: ({ mutate }) => ({
      forgotPassword: async ({ email }: { email: string }) => {
        const {
          data: { forgotPassword }
        } = await mutate({
          variables: { input: { email } }
        });

        return forgotPassword;
      }
    })
  }),
  translate('user')
)(ForgotPassword);

export default ForgotPasswordWithApollo;
