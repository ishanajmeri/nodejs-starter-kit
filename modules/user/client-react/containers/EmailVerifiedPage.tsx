import React from 'react';
import { History } from 'history';

import EmailVerifiedPageView from '../components/EmailVerifiedPageView';

interface EmailVerifiedPageProps {
  history: History;
}

const EmailVerifiedPage: React.FunctionComponent<EmailVerifiedPageProps> = props => {
  return <EmailVerifiedPageView {...props} />;
};

export default EmailVerifiedPage;
