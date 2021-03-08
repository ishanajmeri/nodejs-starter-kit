import { useEffect, useState } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';

import USERS_SUBSCRIPTION from '../graphql/UsersSubscription.graphql';
// types
import { FilterUserInput } from '../../../../packages/server/__generated__/globalTypes';

export const useUsersWithSubscription = (
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void,
  filter: FilterUserInput
) => {
  const [usersUpdated, setUsersUpdated] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToUsers();
    return () => unsubscribe();
  });

  const subscribeToUsers = () => {
    return subscribeToMore({
      document: USERS_SUBSCRIPTION,
      variables: { filter },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: { usersUpdated: newData }
          }
        }
      ) => {
        setUsersUpdated(newData);
      }
    });
  };

  return usersUpdated;
};
