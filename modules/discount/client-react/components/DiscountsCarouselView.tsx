import React from 'react';
import { History } from 'history';

import { ListingCarousel } from '@gqlapp/listing-client-react';
import { DiscountsCarouselProps } from '../containers/DiscountsCarousel';

// types
import { getCart_getCart as GetCart } from '@gqlapp/order-client-react/graphql/__generated__/getCart';
import { currentUser_currentUser as CurrentUser } from '@gqlapp/user-client-react/graphql/__generated__/currentUser';

interface DiscountsCarouselViewProps extends DiscountsCarouselProps {
  history: History;
  onDelete: (id: number) => void;
  getCart: GetCart;
  cartLoading: boolean;
  ids?: Array<number | null> | null;
  currentUserLoading: boolean;
  currentUser: CurrentUser;
  style: object;
}

const DiscountsCarouselView: React.FunctionComponent<DiscountsCarouselViewProps> = props => {
  const { title, ids = [], currentUser, currentUserLoading, history, cartLoading, onDelete, getCart, style } = props;

  return ids.length > 0 ? (
    <ListingCarousel
      ids={ids}
      currentUser={currentUser}
      currentUserLoading={currentUserLoading}
      history={history}
      cartLoading={cartLoading}
      onDelete={onDelete}
      getCart={getCart}
      filter={{ isActive: true }}
      title={title}
      style={style}
    />
  ) : null;
};

export default DiscountsCarouselView;
