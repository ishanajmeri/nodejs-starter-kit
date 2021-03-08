import React from 'react';
import { History } from 'history';

import LogoutPageView from '../components/LogoutPageView';

interface LogoutPageProps {
  history: History;
}

const LogoutPage: React.FunctionComponent<LogoutPageProps> = props => {
  return <LogoutPageView {...props} />;
};

export default LogoutPage;
