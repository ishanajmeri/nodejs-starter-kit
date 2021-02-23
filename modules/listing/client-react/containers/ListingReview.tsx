import React, { useEffect } from 'react';
import { History } from 'history';
import { SubscribeToMoreOptions } from 'apollo-client';

import { translate } from '@gqlapp/i18n-client-react';
import { compose } from '@gqlapp/core-common';
import { subscribeToCart } from '@gqlapp/order-client-react/containers/OrderSubscriptions';
import { withGetCart, withDeleteCartItem } from '@gqlapp/order-client-react/containers/OrderOperations';
import { Message } from '@gqlapp/look-client-react';

import ListingReviewView from '../components/ListingReviewView';
import { withListing, withCanUserReview } from './ListingOperations';
import { subscribeToListing, subscribeToListingReview } from './ListingSubscriptions';
import { TranslateFunction } from '@gqlapp/i18n-client-react';

// types
import { listing_listing as Listing } from '../graphql/__generated__/listing';
import { getCart_getCart as GetCart } from '@gqlapp/order-client-react/graphql/__generated__/getCart';
import { currentUser_currentUser as CurrentUser } from '@gqlapp/user-client-react/graphql/__generated__/currentUser';

export interface ListingReviewProps {
  history: History;
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
  listing: Listing;
  deleteOrderDetail: (id: number) => void;
  canUserReviewsubscribeToMore: (options: SubscribeToMoreOptions) => () => void;
  getCart: GetCart;
  location: Location;
  currentUser: CurrentUser;
  cartLoading: boolean;
  canUserReview: boolean;
  loading: boolean;
  t: TranslateFunction;
}

const ListingReview: React.FunctionComponent<ListingReviewProps> = props => {
  const {
    history,
    subscribeToMore,
    listing,
    location,
    canUserReviewsubscribeToMore,
    getCart,
    deleteOrderDetail
  } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
    const subscribe = subscribeToListing(subscribeToMore, listing && listing.id, history);
    const subscribeAddReview = subscribeToListingReview(canUserReviewsubscribeToMore, listing && listing.id);
    const subscribeCart = subscribeToCart(subscribeToMore, getCart && getCart.id, {});
    return () => {
      subscribe();
      subscribeAddReview();
      subscribeCart();
    };
  }, [history, subscribeToMore, listing, location, canUserReviewsubscribeToMore, getCart]);

  const handleDelete = (id: number) => {
    try {
      deleteOrderDetail(id);
      Message.error('Removed from Cart.');
    } catch (e) {
      throw Error(e);
    }
  };

  return <ListingReviewView onDelete={handleDelete} {...props} />;
};

export default compose(
  withListing,
  withCanUserReview,
  withGetCart,
  withDeleteCartItem,
  translate('listing')
)(ListingReview);
