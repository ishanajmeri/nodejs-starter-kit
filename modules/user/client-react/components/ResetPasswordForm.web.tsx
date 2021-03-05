import React from 'react';
import { withFormik, FormikProps } from 'formik';

import { isFormError, FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { required, minLength, validate, match } from '@gqlapp/validation-common-react';
import { Form, RenderField, Alert, SubmitButton } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';
// types
import { ResetPasswordInput } from '../../../../packages/server/__generated__/globalTypes';

const resetPasswordFormSchema = {
  password: [required, minLength(settings.auth.password.minLength)],
  passwordConfirmation: [match('password'), required, minLength(settings.auth.password.minLength)]
};
interface ResetPasswordFormProps {
  t: TranslateFunction;
  onSubmit: (values: ResetPasswordInput) => Promise<string>;
}
interface FormValues {
  token: string;
  password: string;
  passwordConfirmation: string;
  errorMsg?: string;
}
const ResetPasswordForm: React.FC<ResetPasswordFormProps & FormikProps<FormValues>> = props => {
  const { values, handleSubmit, errors, t } = props;
  return (
    <Form name="resetPassword" onSubmit={handleSubmit}>
      <Field
        name="password"
        component={RenderField}
        type="password"
        label={t('resetPass.form.field.pass')}
        value={values.password}
      />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label={t('resetPass.form.field.passConf')}
        value={values.passwordConfirmation}
      />
      {errors && errors.errorMsg && <Alert color="error">{errors.errorMsg}</Alert>}
      <SubmitButton color="primary" type="submit">
        {t('resetPass.form.btnSubmit')}
      </SubmitButton>
    </Form>
  );
};
const ResetPasswordFormWithFormik = withFormik<ResetPasswordFormProps, FormValues>({
  enableReinitialize: true,
  mapPropsToValues: () => ({ token: '', password: '', passwordConfirmation: '' }),
  async handleSubmit(values, { setErrors, resetForm, props: { onSubmit } }) {
    await onSubmit(values)
      .then(() => resetForm())
      .catch(e => {
        if (isFormError(e)) {
          setErrors(e.errors);
        } else {
          throw e;
        }
      });
  },
  validate: values => validate(values, resetPasswordFormSchema),
  displayName: 'LoginForm' // helps with React DevTools
});

export default translate('user')(ResetPasswordFormWithFormik(ResetPasswordForm));
