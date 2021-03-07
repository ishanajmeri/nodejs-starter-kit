import React from 'react';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { Card, ModalDrawer } from '@gqlapp/look-client-react';

import MobileVerification from '../../containers/verification/MobileVerification.web';
import VerificationIconComponent from './VerificationIconComponent.web';

interface VerificationViewProps {
  t: TranslateFunction;
  data: any;
  verification: any;
}

const VerificationView: React.FunctionComponent<VerificationViewProps> = ({ data, verification, t }) => {
  const mobile = verification.mobileVerification;

  const [vStatus, setvStatus] = React.useState(mobile && mobile.isVerified);
  return (
    <Card>
      <h3>{t('profile.card.group.verification.title')}</h3>

      <ModalDrawer
        buttonText={
          <>
            {'Mobile'}&nbsp;
            <VerificationIconComponent vStatus={vStatus} setvStatus={setvStatus} />
          </>
        }
        type="dashed"
        modalTitle="Mobile Verification"
      >
        <MobileVerification mobile={mobile} />
      </ModalDrawer>
    </Card>
  );
};

export default translate('user')(VerificationView);
