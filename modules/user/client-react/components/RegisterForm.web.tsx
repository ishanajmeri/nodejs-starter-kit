import React from 'react';
import { withFormik, FormikProps } from 'formik';

import { isFormError, FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { match, email, minLength, required, validate } from '@gqlapp/validation-common-react';
import { Icon, Form, RenderField, Button, Alert } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

// types
import { RegisterUserInput } from '../../../../packages/server/__generated__/globalTypes';

const registerFormSchema = {
  username: [required, minLength(3)],
  email: [required, email],
  password: [required, minLength(settings.auth.password.minLength)],
  passwordConfirmation: [match('password'), required, minLength(settings.auth.password.minLength)]
};
interface RegisterFormProps {
  t: TranslateFunction;
  submitting: boolean;
  onSubmit: (values: RegisterUserInput) => void;
}
interface FormValues {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  errorMsg?: string;
}
const RegisterForm: React.FC<RegisterFormProps & FormikProps<FormValues>> = props => {
  const { values, handleSubmit, submitting, errors, t } = props;
  return (
    <Form name="register" onSubmit={handleSubmit}>
      <Field
        name="username"
        icon="UserOutlined"
        component={RenderField}
        type="text"
        label={t('reg.form.field.name')}
        value={values.username}
      />
      <Field
        icon="MailOutlined"
        name="email"
        component={RenderField}
        type="text"
        label={t('reg.form.field.email')}
        value={values.email}
      />
      <Field
        name="password"
        icon="KeyOutlined"
        component={RenderField}
        type="password"
        label={t('reg.form.field.pass')}
        value={values.password}
      />
      <Field
        name="passwordConfirmation"
        icon="KeyOutlined"
        component={RenderField}
        type="password"
        label={t('reg.form.field.passConf')}
        value={values.passwordConfirmation}
      />
      <div className="text-center">
        {errors && errors.errorMsg && <Alert color="error">{errors.errorMsg}</Alert>}
        <Button block color="primary" type="submit" disabled={submitting}>
          <Icon type="UserAddOutlined" /> {t('reg.form.btnSubmit')}
        </Button>
      </div>
    </Form>
  );
};

const RegisterFormWithFormik = withFormik<RegisterFormProps, FormValues>({
  mapPropsToValues: () => ({ username: '', email: '', password: '', passwordConfirmation: '' }),
  validate: values => validate(values, registerFormSchema),
  async handleSubmit(values, { setErrors, props: { onSubmit } }) {
    try {
      await onSubmit(values);
    } catch (e) {
      if (isFormError(e)) {
        setErrors(e.errors);
      } else {
        throw e;
      }
    }
  },
  enableReinitialize: true,
  displayName: 'SignUpForm' // helps with React DevTools
});

export default translate('user')(RegisterFormWithFormik(RegisterForm));
