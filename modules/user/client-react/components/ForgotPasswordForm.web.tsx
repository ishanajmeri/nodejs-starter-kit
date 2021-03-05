import React from 'react';
import { withFormik, FormikProps } from 'formik';

import { isFormError, FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { Form, RenderField, Alert, NextButton } from '@gqlapp/look-client-react';
import { required, email, validate } from '@gqlapp/validation-common-react';
// types
import { ForgotPasswordInput } from '../../../../packages/server/__generated__/globalTypes';

const forgotPasswordFormSchema = {
  email: [required, email]
};
interface ForgotPasswordFormProps {
  t: TranslateFunction;
  sent: boolean;
  onSubmit: (values: ForgotPasswordInput) => Promise<string>;
}
interface FormValues {
  email: string;
  errorMsg?: string;
}
const ForgotPasswordForm: React.FC<ForgotPasswordFormProps & FormikProps<FormValues>> = props => {
  const { handleSubmit, errors, sent, values, t } = props;
  return (
    <Form name="forgotPassword" onSubmit={handleSubmit}>
      {sent && <Alert color="success">{t('forgotPass.form.submitMsg')}</Alert>}
      <Field
        name="email"
        component={RenderField}
        type="email"
        label={t('forgotPass.form.fldEmail')}
        value={values.email}
      />
      <div className="text-center">
        {errors && errors.errorMsg && <Alert color="error">{errors.errorMsg}</Alert>}
        <NextButton color="primary" type="submit">
          {t('forgotPass.form.btnSubmit')}
        </NextButton>
      </div>
    </Form>
  );
};

const ForgotPasswordFormWithFormik = withFormik<ForgotPasswordFormProps, FormValues>({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: '' }),
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
  validate: values => validate(values, forgotPasswordFormSchema),
  displayName: 'ForgotPasswordForm' // helps with React DevTools
});

export default translate('user')(ForgotPasswordFormWithFormik(ForgotPasswordForm));
