import React from 'react';
import { Alert, Message, Spinner } from '@gqlapp/look-client-react';
import { graphql } from 'react-apollo';

import MobileVerificationFormComponent from '../../components/verification/MobileVerificationFormComponent.web';
import Mobile from '../../components/verification/Mobile.web';
import ADD_Mobile from '../../graphql/AddMobile.graphql';
// types
import {
  addUserMobileVariables,
  addUserMobile as addUserMobileRespose
} from '../../graphql/__generated__/addUserMobile';
import { AddMobileInput } from './../../../../../packages/server/__generated__/globalTypes';

export interface MobileAddProps {
  mobile: {
    isVerified: boolean;
  };
  setvStatus: (value: boolean) => void;
  addMobile: (mobile: string, otp: number) => Promise<{ otpSent: string; error: string; isVerified: boolean }>;
}

export interface MobileAddState {
  loading: boolean;
  form: boolean;
  otp: boolean;
  vStatus: boolean;
  mobile: any;
  error?: string | null;
  mobileNo?: string | null;
}

class MobileAdd extends React.Component<MobileAddProps, MobileAddState> {
  constructor(props: MobileAddProps) {
    super(props);
    this.state = {
      loading: false,
      form: props.mobile && props.mobile.isVerified ? false : true,
      otp: false,
      vStatus: props.mobile && props.mobile.isVerified,
      mobile: props.mobile || null
    };

    this.setMobile = this.setMobile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
  }
  public setMobile(mobile: any) {
    this.setState({ mobile });
    Message.info('Mobile number has been verified.');
  }

  public toggleLoading() {
    this.setState({ loading: !this.state.loading });
  }

  public onSubmit(
    addMobile: (mobile: string, otp: number) => Promise<{ otpSent: string; error: string; isVerified: boolean }>
  ) {
    return async (values: AddMobileInput) => {
      // To Do call mobile Data check if verified or not

      const mobileData = await addMobile(values.mobile, values.otp);
      if (mobileData.otpSent && typeof values.otp === 'undefined') {
        this.setState({ otp: true, mobileNo: values.mobile });
      } else if (!mobileData.otpSent) {
        Message.info('Unable to send OTP.');
      } else {
        // set error or verified
        if (mobileData.error && !mobileData.isVerified) {
          this.setState({ error: mobileData.error });
        } else {
          this.setState({
            vStatus: true,
            error: null,
            otp: false,
            form: false
          });
          this.props.setvStatus(true);
          this.setMobile(mobileData);
        }
      }
    };
  }

  public async onChange(values: AddMobileInput) {
    // fix this
    Message.loading('Please wait...');
    this.setState({ loading: true });
    await this.onSubmit(this.props.addMobile)(values);
    this.setState({ loading: false });
  }

  // async onSubmit(values, addMobile) {
  //   console.log(addMobile);
  //   // addMobile(values.mobileId, values.dob);
  // }

  public render() {
    return (
      <>
        {this.state.loading ? <Spinner size="small" /> : ''}
        {this.state.otp ? <Alert message={`An OTP has been sent to ${this.state.mobileNo}`} /> : ''}
        {this.state.error ? <Alert type="error" message={`Error Occurred: `} description={this.state.error} /> : ''}
        {this.state.form ? <MobileVerificationFormComponent otp={this.state.otp} onSubmit={this.onChange} /> : ''}

        {this.state.vStatus ? <Mobile mobile={this.state.mobile} /> : ''}
      </>
    );
  }
}

export default graphql<{}, addUserMobileRespose, addUserMobileVariables, {}>(ADD_Mobile, {
  props: ({ mutate }) => ({
    addMobile: async (mobile: string, otp: number) => {
      const MobileData = await mutate({
        variables: { input: { mobile, otp } }
      });

      return MobileData.data.addUserMobile;
    }
  })
})(MobileAdd);
