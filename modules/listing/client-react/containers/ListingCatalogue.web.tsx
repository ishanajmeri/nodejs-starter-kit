import React, { useEffect } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { History } from 'history';
import { Message } from '@gqlapp/look-client-react';

import { compose } from '@gqlapp/core-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { withGetCart, withDeleteCartItem } from '@gqlapp/order-client-react/containers/OrderOperations';
import { subscribeToCart } from '@gqlapp/order-client-react/containers/OrderSubscriptions';
import { withCurrentUser } from '@gqlapp/user-client-react/containers/UserOperations';
import { currentUser_currentUser as CurrentUser } from '@gqlapp/user-client-react/graphql/__generated__/currentUser';

import ListingCatalogueView from '../components/ListingCatalogueView.web';
import { subscribeToListings } from './ListingSubscriptions';
import { withListingsState, withFilterUpdating, withOrderByUpdating, withListings } from './ListingOperations';
import ROUTES from '../routes';

// types
import { FilterListInput, OrderByListInput } from '../../../../packages/server/__generated__/globalTypes';
import { listings_listings as Listings } from '../graphql/__generated__/listings';
import { getCart_getCart as GetCart } from '@gqlapp/order-client-react/graphql/__generated__/getCart';

export interface ListingsCatalogueProps {
  loading: boolean;
  cartLoading: boolean;
  listings: Listings;
  history: History;
  currentUser: CurrentUser;
  getCart: GetCart;
  filter: FilterListInput;
  onLowerCostChange: (cost: number) => void;
  onUpperCostChange: (cost: number) => void;
  onCategoryChange: ({ categoryId, allSubCategory }: { categoryId: number; allSubCategory: boolean }) => void;
  onFiltersRemove: (filter: FilterListInput, orderBy: OrderByListInput) => void;
  onBrandChange: (brand: string[]) => void;
  onSearchTextChange: (serachText: string) => void;
  onRoleChange: (role: string) => void;
  onIsActiveChange: (active: boolean) => void;
  onDiscountChange: (discount: number) => void;
  onRatedChange: (rated: number) => void;
  onOrderBy: (orderBy: OrderByListInput) => void;
  loadData: (endCursor: number, action: string) => { data: { listings: Listings } };
  deleteOrderDetail: (id: number) => void;
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
  t: TranslateFunction;
}

const ListingsCatalogue: React.FC<ListingsCatalogueProps> = props => {
  const { subscribeToMore, filter, deleteOrderDetail, getCart } = props;

  useEffect(() => {
    const subscribe = subscribeToListings(subscribeToMore, filter);
    const subscribeCart = subscribeToCart(subscribeToMore, getCart && getCart.id, {});
    return () => {
      subscribe();
      subscribeCart();
    };
  });

  const handleDelete = (id: number) => {
    try {
      deleteOrderDetail(id);
      Message.error('Removed from Cart.');
    } catch (e) {
      throw Error(e);
    }
  };
  // console.log('props', props);
  return (
    <ListingCatalogueView
      title={'All Listings'}
      onDelete={handleDelete}
      emptyLink={`${ROUTES.add}`}
      showFilter={true}
      {...props}
    />
  );
};

export default compose(
  withListingsState,
  withGetCart,
  withCurrentUser,
  withFilterUpdating,
  withOrderByUpdating,
  withListings,
  withDeleteCartItem,
  translate('listing')
)(ListingsCatalogue);
