import { FunctionComponent } from 'react';
import { graphql } from 'react-apollo';
import { match as Match } from 'react-router-dom';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { History } from 'history';

import { PLATFORM, removeTypename } from '@gqlapp/core-common';
import { Message } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';
import { currentUser_currentUser as CurrentUser } from '@gqlapp/user-client-react/graphql/__generated__/currentUser';

// Query
import LISTING_QUERY from '../graphql/ListingQuery.graphql';
import GET_LISTING_BRAND_LIST_QUERY from '../graphql/GetBrandListQuery.graphql';
import LISTINGS_QUERY from '../graphql/ListingsQuery.graphql';
import MY_LISTINGS_BOOKMARK_QUERY from '../graphql/MyListingsBookmark.graphql';
import LISTING_BOOKMARK_STATUS from '../graphql/ListingBookmarkStatus.graphql';
import CAN_USER_REVIEW from '../graphql/CanUserReview.graphql';
import LISTINGS_STATE_QUERY from '../graphql/ListingsStateQuery.client.graphql';

// Mutation
import ADD_LISTING from '../graphql/AddListing.graphql';
import DUPLICATE_LISTING from '../graphql/DuplicateListing.graphql';
import EDIT_LISTING from '../graphql/EditListing.graphql';
import DELETE_LISTING from '../graphql/DeleteListing.graphql';
import TOOGLE_LISTING_BOOKMARK from '../graphql/ToggleListingBookmark.graphql';
import SHARE_LISTING_BY_EMAIL from '../graphql/ShareListingByEmail.graphql';

// Filter
import UPDATE_ORDER_BY_LISTING from '../graphql/UpdateOrderByListing.client.graphql';
import UPDATE_LISTING_FILTER from '../graphql/UpdateListingFilter.client.graphql';

import ROUTES from '../routes';

// types
import {
  OrderByListInput,
  FilterListInput,
  AddListingInput,
  EditListingInput,
  ShareListingByEmailInput,
  CategoryFilter
} from '../../../../packages/server/__generated__/globalTypes';
import {
  listing as listingResponse,
  listing_listing as Listing,
  listingVariables
} from '../graphql/__generated__/listing';
import { listings as listingsResponse, listingsVariables } from '../graphql/__generated__/listings';
import { getBrandList as getBrandListResponse } from '../graphql/__generated__/getBrandList';
import {
  myListingsBookmark as myListingsBookmarkResponse,
  myListingsBookmarkVariables
} from '../graphql/__generated__/myListingsBookmark';
import { listingBookmarkStatus as listingBookmarkStatusResponse } from '../graphql/__generated__/listingBookmarkStatus';
import { canUserReview as canUserReviewResponse, canUserReviewVariables } from '../graphql/__generated__/canUserReview';
import { deleteListingVariables } from '../graphql/__generated__/deleteListing';
import { addListing as AddListing, addListingVariables } from '../graphql/__generated__/addListing';
import {
  duplicateListing as DuplicateListing,
  duplicateListingVariables
} from '../graphql/__generated__/duplicateListing';
import { editListingVariables } from '../graphql/__generated__/editListing';
import {
  addOrRemoveListingBookmark as AddOrRemoveListingBookmark,
  addOrRemoveListingBookmarkVariables
} from '../graphql/__generated__/addOrRemoveListingBookmark';
import { shareListingByEmailVariables } from '../graphql/__generated__/shareListingByEmail';

const limit =
  PLATFORM === 'web' || PLATFORM === 'server'
    ? settings.pagination.web.itemsNumber
    : settings.pagination.mobile.itemsNumber;

// Query
export const withListingsState = (Component: FunctionComponent) =>
  graphql(LISTINGS_STATE_QUERY, {
    props({ data: { listingsState, loading } }) {
      const brand = listingsState && listingsState.filter.brand;
      if (listingsState && listingsState.filter) {
        delete listingsState.filter.brand;
      }
      const state = {
        ...removeTypename(listingsState)
      };
      if (state.filter) {
        state.filter.brand = brand;
      }
      return {
        ...state,
        loadingState: loading
      };
    }
  })(Component);

export const withListings = (Component: FunctionComponent) =>
  graphql<
    {
      orderBy: OrderByListInput;
      filter: FilterListInput;
      addFilter: FilterListInput;
      match: Match<{ cid: string }>;
      navigation: NavigationScreenProp<NavigationState, NavigationParams>;
      ids: number[];
    },
    listingsResponse,
    listingsVariables,
    {}
  >(LISTINGS_QUERY, {
    options: ({ orderBy, addFilter, filter, match, navigation, ids }) => {
      return {
        variables: {
          limit,
          after: 0,
          orderBy,
          filter: {
            ...addFilter,
            ...filter,
            categoryFilter: {
              categoryId: Number(
                (match ? match.params.cid : navigation && navigation.state.params.cid) ||
                  (filter && filter.categoryFilter && filter.categoryFilter.categoryId) ||
                  0
              ),
              allSubCategory: filter && filter.categoryFilter && filter.categoryFilter.allSubCategory
            }
          },
          ids
        },
        fetchPolicy: 'network-only'
      };
    },
    props: ({ data }) => {
      const { loading, error, listings, fetchMore, subscribeToMore, updateQuery } = data;
      const loadData = (after: number, dataDelivery: string) => {
        return fetchMore({
          variables: {
            after
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.listings.totalCount;
            const newEdges = fetchMoreResult.listings.edges;
            const pageInfo = fetchMoreResult.listings.pageInfo;
            const rangeValues = fetchMoreResult.listings.rangeValues;
            const displayedEdges = dataDelivery === 'add' ? [...previousResult.listings.edges, ...newEdges] : newEdges;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              listings: {
                totalCount,
                edges: displayedEdges,
                pageInfo,
                rangeValues,
                __typename: 'Listings'
              }
            };
          }
        });
      };
      if (error) {
        throw new Error(error.message);
      }
      return { loading, listings, subscribeToMore, loadData, updateQuery };
    }
  })(Component);

export const withListing = (Component: FunctionComponent) =>
  graphql<
    {
      modalId: number;
      match: Match<{ id: string }>;
      navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    },
    listingResponse,
    listingVariables,
    {}
  >(LISTING_QUERY, {
    options: props => {
      let id = '0';
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id: Number(id) || props.modalId }
      };
    },
    props({ data: { loading, error, listing, subscribeToMore, updateQuery } }) {
      if (error) {
        throw new Error(error.message);
      }
      return { loading, listing, subscribeToMore, updateQuery };
    }
  })(Component);

export const withGetBrandList = (Component: FunctionComponent) =>
  graphql<{}, getBrandListResponse, {}, {}>(GET_LISTING_BRAND_LIST_QUERY, {
    props({ data: { loading, error, getBrandList, subscribeToMore, updateQuery } }) {
      if (error) {
        throw new Error(error.message);
      }
      return { loading, getBrandList, subscribeToMore, updateQuery };
    }
  })(Component);

export const withMyListingsBookmark = (Component: FunctionComponent) =>
  graphql<
    {
      currentUser: CurrentUser;
      orderBy: OrderByListInput;
      filter: FilterListInput;
    },
    myListingsBookmarkResponse,
    myListingsBookmarkVariables,
    {}
  >(MY_LISTINGS_BOOKMARK_QUERY, {
    options: ({ currentUser, orderBy, filter }) => {
      return {
        variables: {
          userId: currentUser && currentUser.id,
          limit,
          after: 0,
          orderBy,
          filter
        },
        fetchPolicy: 'network-only'
      };
    },
    props: ({ data }) => {
      const { loading, error, myListingsBookmark, fetchMore, subscribeToMore, updateQuery } = data;
      const loadData = (after: number, dataDelivery: string) => {
        return fetchMore({
          variables: {
            after
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.myListingsBookmark.totalCount;
            const newEdges = fetchMoreResult.myListingsBookmark.edges;
            const pageInfo = fetchMoreResult.myListingsBookmark.pageInfo;
            const rangeValues = fetchMoreResult.myListingsBookmark.rangeValues;
            const displayedEdges =
              dataDelivery === 'add' ? [...previousResult.myListingsBookmark.edges, ...newEdges] : newEdges;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              myListingsBookmark: {
                totalCount,
                edges: displayedEdges,
                pageInfo,
                rangeValues,
                __typename: 'Listings'
              }
            };
          }
        });
      };
      if (error) {
        throw new Error(error.message);
      }
      return {
        loading,
        myListingsBookmark,
        subscribeToMore,
        loadData,
        updateQuery
      };
    }
  })(Component);

export const withListingBookmarkStatus = (Component: FunctionComponent) =>
  graphql<
    {
      currentUser: CurrentUser;
      listing: Listing;
    },
    listingBookmarkStatusResponse,
    {},
    {}
  >(LISTING_BOOKMARK_STATUS, {
    options: ({ listing, currentUser }) => {
      return {
        variables: {
          listingId: Number(listing && listing.id),
          userId: currentUser && currentUser.id
        },
        fetchPolicy: 'network-only'
      };
    },
    props({ data: { loading, error, listingBookmarkStatus } }) {
      if (error) {
        throw new Error(error.message);
      }
      return { loading, listingBookmarkStatus };
    }
  })(Component);

export const withCanUserReview = (Component: FunctionComponent) =>
  graphql<
    {
      match: Match<{ id: string }>;
      navigation: NavigationScreenProp<NavigationState, NavigationParams>;
      currentUser: CurrentUser;
      listing: Listing;
    },
    canUserReviewResponse,
    canUserReviewVariables,
    {}
  >(CAN_USER_REVIEW, {
    options: props => {
      let id = '0';
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }
      return {
        variables: {
          listingId: Number((props.listing && props.listing.id) || id),
          userId: props.currentUser && props.currentUser.id
        },
        fetchPolicy: 'network-only'
      };
    },
    props({ data: { loading, error, canUserReview, subscribeToMore } }) {
      if (error) {
        throw new Error(error.message);
      }
      return {
        loading,
        canUserReview,
        canUserReviewsubscribeToMore: subscribeToMore
      };
    }
  })(Component);

// Mutation
export const withListingsDeleting = (Component: FunctionComponent) =>
  graphql<{}, {}, deleteListingVariables, {}>(DELETE_LISTING, {
    props: ({ mutate }) => ({
      deleteListing: (id: number) => {
        mutate({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteListing: {
              id,
              __typename: 'Listing'
            }
          }
        });
      }
    })
  })(Component);

export const withAddListing = (Component: FunctionComponent) =>
  graphql<{}, AddListing, addListingVariables, {}>(ADD_LISTING, {
    props: ({ mutate }) => ({
      addListing: async (values: AddListingInput) => {
        try {
          const {
            data: { addListing: id }
          } = await mutate({
            variables: {
              input: values
            }
          });
          return id;
        } catch (e) {
          Message.destroy();
          Message.error("Couldn't perform the action");
          console.error(e);
        }
      }
    })
  })(Component);

export const withDulicateListing = (Component: FunctionComponent) =>
  graphql<{}, DuplicateListing, duplicateListingVariables, {}>(DUPLICATE_LISTING, {
    props: ({ mutate }) => ({
      duplicateListing: async (id: number) => {
        Message.loading('Please wait...', 0);
        try {
          Message.destroy();
          const {
            data: { duplicateListing }
          } = await mutate({
            variables: { id }
          });

          if (duplicateListing.errors) {
            return { errors: duplicateListing.errors };
          }
          Message.success('Duplicate listing created!');
          return duplicateListing;
        } catch (e) {
          Message.error("Couldn't perform the action");
          throw Error(e);
        }
      }
    })
  })(Component);

export const withEditListing = (Component: FunctionComponent) =>
  graphql<
    {
      history: History;
      currentUser: CurrentUser;
      navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    },
    {},
    editListingVariables,
    {}
  >(EDIT_LISTING, {
    props: ({
      ownProps: {
        history,
        navigation,
        currentUser: { role }
      },
      mutate
    }) => ({
      editListing: async (input: EditListingInput) => {
        try {
          Message.destroy();
          Message.loading('Please wait...', 0);
          // console.log('input', input);
          await mutate({
            variables: {
              input
            }
          });
          Message.destroy();
          Message.success('Changes Saved.');
          if (history) {
            if (role === 'admin') {
              return history.push(`${ROUTES.adminPanel}`);
            } else {
              return history.push(`${ROUTES.myListing}`);
            }
          }
          if (navigation) {
            if (role === 'admin') {
              return navigation.navigate('ListingCatalogue');
            } else {
              return navigation.navigate('MyListings');
            }
          }
        } catch (e) {
          Message.destroy();
          Message.error("Couldn't perform the action");
          console.error(e);
        }
      }
    })
  })(Component);

export const withToogleListingBookmark = (Component: FunctionComponent) =>
  graphql<{}, AddOrRemoveListingBookmark, addOrRemoveListingBookmarkVariables, {}>(TOOGLE_LISTING_BOOKMARK, {
    props: ({ mutate }) => ({
      addOrRemoveListingBookmark: async (listingId: number, userId: number) => {
        Message.destroy();
        Message.loading('Please wait...', 0);
        try {
          const {
            data: { addOrRemoveListingBookmark }
          } = await mutate({
            variables: { listingId, userId }
          });

          Message.destroy();
          Message.success(addOrRemoveListingBookmark);
        } catch (e) {
          Message.destroy();
          Message.error("Couldn't perform the action");
          console.error(e);
        }
      }
    })
  })(Component);

export const withShareListingByEmail = (Component: FunctionComponent) =>
  graphql<{}, {}, shareListingByEmailVariables, {}>(SHARE_LISTING_BY_EMAIL, {
    props: ({ mutate }) => ({
      shareListingByEmail: async (input: ShareListingByEmailInput) => {
        const { data: shareListingByEmail } = await mutate({
          variables: { input }
        });
        return shareListingByEmail;
      }
    })
  })(Component);

// Filter
export const withOrderByUpdating = (Component: FunctionComponent) =>
  graphql(UPDATE_ORDER_BY_LISTING, {
    props: ({ mutate }) => ({
      onOrderBy: (orderBy: OrderByListInput) => {
        // console.log('orderby', mutate);
        mutate({ variables: { orderBy } });
      }
    })
  })(Component);

export const withFilterUpdating = (Component: FunctionComponent) =>
  graphql(UPDATE_LISTING_FILTER, {
    props: ({ mutate }) => ({
      onSearchTextChange(searchText: string) {
        // console.log("searchtext", searchText);
        mutate({ variables: { filter: { searchText } } });
      },
      onDiscountChange(discount: number) {
        mutate({ variables: { filter: { discount } } });
      },
      onUpperCostChange(cost: number) {
        mutate({ variables: { filter: { upperCost: cost } } });
      },
      onLowerCostChange(cost: number) {
        mutate({ variables: { filter: { lowerCost: cost } } });
      },
      onIsActiveChange(isActive: boolean) {
        mutate({ variables: { filter: { isActive } } });
      },
      onBrandChange(brand: string[]) {
        mutate({ variables: { filter: { brand } } });
      },
      onRatedChange(popularity: number) {
        mutate({ variables: { filter: { popularity } } });
      },
      onCategoryChange(categoryFilter: CategoryFilter) {
        // console.log(categoryFilter);
        mutate({
          variables: {
            filter: {
              categoryFilter: {
                categoryId: categoryFilter.categoryId,
                allSubCategory: categoryFilter.allSubCategory,
                __typename: 'CategoryFilter'
              }
            }
          }
        });
      },
      // onIsFeaturedChange(isFeatured) {
      //   mutate({ variables: { filter: { isFeatured } } });
      // },
      // onIsDiscount(isDiscount) {
      //   mutate({ variables: { filter: { isDiscount } } });
      // },
      // onIsNewChange(isNew) {
      //   mutate({ variables: { filter: { isNew } } });
      // },
      onFiltersRemove(filter: FilterListInput, orderBy: OrderByListInput) {
        mutate({
          variables: {
            filter: {
              ...filter,
              categoryFilter: {
                ...filter.categoryFilter,
                __typename: 'CategoryFilter'
              },
              __typename: 'FilterListInput'
            },
            orderBy: {
              ...orderBy,
              __typename: 'OrderByListInput'
            }
          }
        });
      }
    })
  })(Component);
