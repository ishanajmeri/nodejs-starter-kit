import React, { useState, FormEvent } from 'react';
import { withFormik, FormikProps } from 'formik';
import { isEmpty } from 'lodash';

import { IMG_ASPECT } from '@gqlapp/listing-common';
import { isFormError, FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { email, minLength, required, match, validate } from '@gqlapp/validation-common-react';
import {
  Form,
  RenderField,
  RenderSelect,
  RenderCheckBox,
  Option,
  Alert,
  SubmitButton,
  // RenderUpload,
  RenderUploadWithCrop,
  Row,
  Col,
  ModalDrawer
} from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';
// types
import { user_user_user_auth as Auth, user_user_user as User } from '../graphql/__generated__/user';
import { EditUserInput, ProfileInput, AuthInput } from '../../../../packages/server/__generated__/globalTypes';

const userFormSchema = {
  username: [required, minLength(3)],
  email: [required, email]
};

const createUserFormSchema = {
  ...userFormSchema,
  password: [required, minLength(settings.auth.password.minLength)],
  passwordConfirmation: [required, match('password'), minLength(settings.auth.password.minLength)]
};

const updateUserFormSchema = {
  ...userFormSchema,
  password: [minLength(settings.auth.password.minLength)],
  passwordConfirmation: [match('password'), minLength(settings.auth.password.minLength)]
};

interface UserFormProps {
  t: TranslateFunction;
  shouldDisplayRole: boolean;
  shouldDisplayActive: boolean;
  onSubmit: (values: EditUserInput) => void;
  initialValues: User;
}
interface FormValues {
  id: number;
  username: string;
  email: string;
  isActive: boolean | null;
  role: string;
  profile?: ProfileInput | null;
  auth?: AuthInput | null;
  password: string;
  passwordConfirmation: string;
  errorMsg?: string;
}

const UserForm: React.FC<UserFormProps & FormikProps<FormValues>> = props => {
  const { values, handleSubmit, errors, setFieldValue, t, shouldDisplayRole, shouldDisplayActive } = props;
  const [load, setLoad] = useState(false);
  // const { username, email, role, isActive, profile, auth } = values;

  return (
    <Form name="user" onSubmit={handleSubmit}>
      <Row type="flex" gutter={24}>
        <Col lg={14} xs={24}>
          <Field
            name="username"
            component={RenderField}
            type="text"
            label={t('userEdit.form.field.name')}
            value={values.username}
          />
          <Field
            name="email"
            component={RenderField}
            type="email"
            label={t('userEdit.form.field.email')}
            value={values.email}
          />
        </Col>
        <Col lg={10} xs={24} align="center">
          &nbsp; &nbsp;
          <Col lg={3} xs={24} />
          <Col lg={18} xs={24}>
            <Field
              name="profile.avatar"
              value={values.profile.avatar}
              setload={e => setLoad(e)}
              load={load}
              shape="round"
              height={IMG_ASPECT.medium.height}
              width={IMG_ASPECT.medium.width}
              // component={RenderUpload}
              component={RenderUploadWithCrop}
              label={'Avatar'}
              cropPropSettings={{
                shape: 'round'
              }}
            />
          </Col>
        </Col>
      </Row>

      {shouldDisplayRole && (
        <Field
          name="role"
          component={RenderSelect}
          type="select"
          label={t('userEdit.form.field.role.label')}
          value={values.role}
        >
          <Option value="user">{t('userEdit.form.field.role.user')}</Option>
          <Option value="admin">{t('userEdit.form.field.role.admin')}</Option>
        </Field>
      )}
      {shouldDisplayActive && (
        <Field
          name="isActive"
          component={RenderCheckBox}
          type="checkbox"
          label={t('userEdit.form.field.active')}
          checked={values.isActive}
        />
      )}
      <Field
        name="firstName"
        component={RenderField}
        type="text"
        label={t('userEdit.form.field.firstName')}
        value={values.profile.firstName}
        onChange={(value: ProfileInput) => setFieldValue('profile', { ...values.profile, firstName: value })}
      />
      <Field
        name="lastName"
        component={RenderField}
        type="text"
        label={t('userEdit.form.field.lastName')}
        value={values.profile.lastName}
        onChange={(value: ProfileInput) => setFieldValue('profile', { ...values.profile, lastName: value })}
      />
      {settings.auth.certificate.enabled && (
        <Field
          name="serial"
          component={RenderField}
          type="text"
          label={t('userEdit.form.field.serial')}
          value={values.auth && values.auth.certificate && values.auth.certificate.serial}
          onChange={(value: Auth) =>
            setFieldValue('auth', { ...values.auth, certificate: { ...values.auth.certificate, serial: value } })
          }
        />
      )}
      {errors && errors.errorMsg && <Alert color="error">{errors.errorMsg}</Alert>}
      <Row type="flex" gutter={24}>
        <Col lg={12} md={12} xs={24}>
          <ModalDrawer buttonText={'Reset password'} modalTitle="Reset Password" height="auto" ghost={true}>
            <ResetPasswordForm {...props} load={load} />
          </ModalDrawer>
        </Col>
        <Col lg={12} md={12} xs={24}>
          <SubmitButton color="primary" type="submit" disabled={load}>
            {t('userEdit.form.btnSubmit')}
          </SubmitButton>
        </Col>
      </Row>
    </Form>
  );
};

interface ResetPasswordFormProps {
  t: TranslateFunction;
  values: FormValues;
  handleSubmit: (e?: FormValues | FormEvent<HTMLFormElement>) => void;
  hideModal?: () => void;
  load: boolean;
}

const ResetPasswordForm: React.FunctionComponent<ResetPasswordFormProps> = props => {
  const { t, values, handleSubmit, load, hideModal } = props;
  const { password, passwordConfirmation } = values;
  const handleOnSubmit = () => {
    handleSubmit(values);
    hideModal();
  };
  return (
    <>
      <Field
        name="password"
        component={RenderField}
        type="password"
        label={t('userEdit.form.field.pass')}
        value={password}
      />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label={t('userEdit.form.field.passConf')}
        value={passwordConfirmation}
      />
      <SubmitButton type="submit" disabled={load} onClick={handleOnSubmit}>
        {t('userEdit.form.btnSubmit')}
      </SubmitButton>
    </>
  );
};

const UserFormWithFormik = withFormik<UserFormProps, FormValues>({
  mapPropsToValues: values => {
    return {
      id: values.initialValues && values.initialValues.id,
      username: values.initialValues && values.initialValues.username,
      email: values.initialValues && values.initialValues.email,
      role: (values.initialValues && values.initialValues.role) || 'user',
      isActive: values.initialValues && values.initialValues.isActive,
      password: '',
      passwordConfirmation: '',
      profile: {
        firstName: values.initialValues && values.initialValues.profile && values.initialValues.profile.firstName,
        lastName: values.initialValues && values.initialValues.profile && values.initialValues.profile.lastName,
        avatar: values.initialValues && values.initialValues.profile && values.initialValues.profile.avatar
      },
      auth: {
        ...(values.initialValues && values.initialValues.auth)
      }
    };
  },
  async handleSubmit(values, { setErrors, props: { onSubmit } }) {
    if (values.password === '' || values.passwordConfirmation === '') {
      delete values.passwordConfirmation;
      delete values.password;
    }
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
  displayName: 'SignUpForm ', // helps with React DevTools
  validate: (values, props) =>
    validate(values, isEmpty(props.initialValues) ? createUserFormSchema : updateUserFormSchema)
});

export default translate('user')(UserFormWithFormik(UserForm));
