import React from 'react';

import { compose } from '@gqlapp/core-common';

import { withFilterUpdating, withUsersState, withUserList } from './UserOperations';
import UsersProfileCatalogueView from '../components/UsersProfileCatalogueView';

interface UsersProfileCatalogueProps {}

const UsersProfileCatalogue: React.FunctionComponent<UsersProfileCatalogueProps> = props => {
  return <UsersProfileCatalogueView {...props} />;
};

export default compose(withFilterUpdating, withUsersState, withUserList)(UsersProfileCatalogue);
