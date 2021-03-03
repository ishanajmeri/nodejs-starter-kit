import React from 'react';
import debounce from 'lodash/debounce';
import { graphql } from 'react-apollo';

import { RenderAutoComplete } from '@gqlapp/look-client-react';
import { FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { PLATFORM, compose, removeTypename } from '@gqlapp/core-common';
import UPDATE_FILTER from '@gqlapp/user-client-react/graphql/UpdateFilter.client.graphql';
import USER_LIST_QUERY from '@gqlapp/user-client-react/graphql/UserListQuery.graphql';
import USERS_STATE_QUERY from '@gqlapp/user-client-react/graphql/UsersStateQuery.client.graphql';
import { translate } from '@gqlapp/i18n-client-react';
import settings from '@gqlapp/config';

// types
import { OrderByUserInput, FilterUserInput } from '../../../../packages/server/__generated__/globalTypes';
import {
  userList_userList as UserList,
  userList as userListResponse,
  userListVariables
} from '@gqlapp/user-client-react/graphql/__generated__/userList';

const limit =
  PLATFORM === 'web' || PLATFORM === 'server'
    ? settings.pagination.web.itemsNumber
    : settings.pagination.mobile.itemsNumber;

interface UserAutoCompleteComponentProps {
  name: string;
  setValue: (value: number) => void;
  label: string;
  defaultValue: string;
  icon: string;
  onSearchTextChange: () => void;
  userList: UserList;
}

const UserAutoCompleteComponent: React.FunctionComponent<UserAutoCompleteComponentProps> = props => {
  const { name, setValue, label, defaultValue, onSearchTextChange, icon } = props;
  const handleUserSelect = (value: string) => {
    setValue(props.userList.edges.filter(i => i.node.username === value)[0].node.id);
  };
  return (
    <Field
      icon={icon}
      name={name}
      dataSource={props.userList && props.userList.edges.map(item => item.node.username)}
      component={RenderAutoComplete}
      label={label}
      type="text"
      defaultValue={defaultValue}
      // value={value}
      onSelect={handleUserSelect}
      onSearch={debounce(onSearchTextChange, 300)}
    />
  );
};

export default compose(
  graphql(USERS_STATE_QUERY, {
    props({ data }) {
      return removeTypename(data.usersState);
    }
  }),
  graphql<
    {
      orderBy: OrderByUserInput;
      filter: FilterUserInput;
    },
    userListResponse,
    userListVariables,
    {}
  >(USER_LIST_QUERY, {
    options: ({
      orderBy,
      filter,
      userType
    }: {
      orderBy: OrderByUserInput;
      filter: FilterUserInput;
      userType: string;
    }) => {
      if (filter) {
        filter.role = userType;
      }
      return {
        // eslint-disable-next-line prettier/prettier
        variables: {
          limit,
          after: 0,
          orderBy,
          filter
        },
        fetchPolicy: 'network-only'
      };
    },
    props: ({ data }) => {
      const { loading, error, userList, fetchMore, updateQuery, subscribeToMore } = data;
      // console.log("ops", users);
      const loadData = (after: number, dataDelivery: string) => {
        return fetchMore({
          variables: {
            after
          },

          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.userList.totalCount;
            const newEdges = fetchMoreResult.userList.edges;
            const pageInfo = fetchMoreResult.userList.pageInfo;
            const displayedEdges = dataDelivery === 'add' ? [...previousResult.userList.edges, ...newEdges] : newEdges;

            return {
              userList: {
                // By returning `cursor` here, we update the `fetchMore` function
                // to the new cursor.

                totalCount,
                edges: displayedEdges,
                pageInfo,
                __typename: 'UserList'
              }
            };
          }
        });
      };
      if (error) {
        throw new Error(error);
      }
      return {
        loading,
        userList,
        loadData,
        updateQuery,
        subscribeToMore
      };
    }
  }),
  graphql(UPDATE_FILTER, {
    props: ({ mutate }) => ({
      onSearchTextChange(searchText: string) {
        mutate({ variables: { filter: { searchText } } });
      },
      onRoleChange(role: string) {
        mutate({ variables: { filter: { role } } });
      },
      onIsActiveChange(isActive: boolean) {
        mutate({ variables: { filter: { isActive } } });
      }
    })
  })
)(translate('review')(UserAutoCompleteComponent));
