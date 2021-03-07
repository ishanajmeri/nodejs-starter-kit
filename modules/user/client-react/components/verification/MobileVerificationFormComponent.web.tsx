import React from 'react';
import { withFormik, FormikProps } from 'formik';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { required, phoneNumber, validate } from '@gqlapp/validation-common-react';
import { Form, RenderField, Button } from '@gqlapp/look-client-react';

const MobileFormSchema = {
  mobile: [required, phoneNumber]
};
interface MobileFormProps {
  mobile: {
    mobile: string;
    otp: number;
  };
  onSubmit: (mobile: string, otp: number) => Promise<{ otpSent: string; error: string; isVerified: boolean }>;
  submitting?: boolean;
  t: TranslateFunction;
  otp?: number;
}
interface FormValues {
  mobile: string;
  otp: number;
}
const MobileForm: React.FC<MobileFormProps & FormikProps<FormValues>> = props => {
  const { otp, values, handleSubmit, submitting, t } = props;
  return (
    <Form name="Mobile" onSubmit={handleSubmit}>
      {!otp ? (
        <Field
          name="mobile"
          component={RenderField}
          type="text"
          label={t('mobileOTP.field.mobile')}
          value={values.mobile}
        />
      ) : (
        <Field name="otp" component={RenderField} type="number" label={t('mobileOTP.field.otp')} value={values.otp} />
      )}
      <Button color="primary" type="submit" disabled={submitting}>
        {t('mobileOTP.btn')}
      </Button>
    </Form>
  );
};

const MobileFormWithFormik = withFormik<MobileFormProps, FormValues>({
  mapPropsToValues: props => ({
    mobile: props.mobile && props.mobile.mobile,
    otp: props.mobile && props.mobile.otp
  }),
  validate: values => validate(values, MobileFormSchema),
  handleSubmit(values, { props: { onSubmit } }) {
    onSubmit(values);
    // console.log(values);
  },
  enableReinitialize: true,
  displayName: 'MobileForm' // helps with React DevTools
});

export default translate('user')(MobileFormWithFormik(MobileForm));
