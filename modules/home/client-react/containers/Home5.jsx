import React from 'react';

import { translate } from '@gqlapp/i18n-client-react';
import { compose } from '@gqlapp/core-common';
import { withCurrentUser } from '@gqlapp/user-client-react/containers/UserOperations';

import HomeView5 from '../components/HomeView5';

const Home5 = props => {
  return <HomeView5 {...props} />;
};

export default compose(withCurrentUser, translate('home'))(Home5);
