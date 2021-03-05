import React, { useEffect } from 'react';
import { UpdateQueryOptions, SubscribeToMoreOptions } from 'apollo-client';

import { compose } from '@gqlapp/core-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { PageLayout, MetaTags } from '@gqlapp/look-client-react';

import UsersFilterView from '../components/UsersFilterView.web';
import UsersListView from '../components/UsersListView.web';
import { useUsersWithSubscription } from './withSubscription';
import {
  withFilterUpdating,
  withOrderByUpdating,
  withUsers,
  withUsersDeleting,
  withUsersState,
  updateUsersState
} from './UserOperations';

// types
import { users_users as UserEdges } from '../graphql/__generated__/users';
import { OrderByUserInput, FilterUserInput } from '../../../../packages/server/__generated__/globalTypes';

export interface ErrorObject {
  message: string;
  field: string;
}

export interface UsersProps {
  loading: boolean;
  users: UserEdges;
  filter: FilterUserInput;
  orderBy: OrderByUserInput;
  onSearchTextChange: (serachText: string) => void;
  onIsActiveChange: (active: boolean) => void;
  onFiltersRemove: (filter: FilterUserInput, orderBy: OrderByUserInput) => void;
  onRoleChange: (role: string) => void;
  onOrderBy: (orderBy: OrderByUserInput) => void;
  deleteUser: (id: number) => { errors: ErrorObject[] };
  updateQuery: (mapFn: (previousQueryResult: any, options: UpdateQueryOptions<any>) => any) => void;
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
  t: TranslateFunction;
}

const Users: React.FC<UsersProps> = props => {
  const { t, updateQuery, subscribeToMore } = props;
  const filter = { isActive: true };
  const usersUpdated = useUsersWithSubscription(subscribeToMore, filter);

  useEffect(() => {
    if (usersUpdated) {
      updateUsersState(usersUpdated, updateQuery);
    }
  });

  return (
    <PageLayout>
      <MetaTags title={t('users.title')} description={t('users.meta')} />

      <UsersFilterView {...props} filter={filter} />
      <UsersListView {...props} filter={filter} />
    </PageLayout>
  );
};

export default compose(
  withUsersState,
  withUsers,
  withUsersDeleting,
  withOrderByUpdating,
  withFilterUpdating
)(translate('user')(Users));
