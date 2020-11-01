/* eslint-disable import/no-named-default */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Statistic, Card, message } from 'antd';

import { NO_IMG } from '@gqlapp/listing-common';
import { compose } from '@gqlapp/core-common';
import { Icon, Row, Col } from '@gqlapp/look-client-react';
import { IfLoggedIn } from '@gqlapp/user-client-react/containers/Auth';
import { withAddToCart } from '@gqlapp/order-client-react/containers/OrderOperations';
import { default as ORDER_ROUTES } from '@gqlapp/order-client-react/routes';
import { default as USER_ROUTES } from '@gqlapp/user-client-react/routes';
import AddToCartFormBtns from '@gqlapp/order-client-react/components/AddToCartFormBtns';

import { withToogleListingBookmark } from '../containers/ListingOperations';
import ROUTES from '../routes';
import { useImageLoaded } from './functions';
import RelatedCardSkeleton from './RelatedCardSkeleton';

import BookmarkComponent from './BookmarkComponent';
import CurrencyDisplay from './CurrencyDisplay';

const { Meta } = Card;

const NewLabel = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  padding: 5px;
  color: white;
  background: #0985be;
  z-index: 2;
`;

const ListingWraper = styled.div`
  position: relative;
`;

const RelatedCardComponent = props => {
  const [ref, loaded, onLoad] = useImageLoaded();
  const { currentUser, history, addToCart, componentStyle, inCart, loading, onDelete } = props;

  let listing = props.listing;
  // console.log(props);
  const listing_id = listing && listing.id;
  const listing_is_new = listing && listing.listingFlags && listing.listingFlags.isNew;
  const listing_media =
    listing &&
    listing.listingMedia &&
    listing.listingMedia.length > 0 &&
    listing.listingMedia.filter(lM => lM.type === 'image');
  const listing_img = listing_media && listing_media.length > 0 ? listing_media[0].url : NO_IMG;
  const fixedQuantity = listing && listing.listingOptions && listing.listingOptions.fixedQuantity;
  const isDiscount = listing && listing.listingFlags && listing.listingFlags.isDiscount;
  const discount =
    listing && listing.listingCostArray && listing.listingCostArray.length > 0 && listing.listingCostArray[0].discount;
  const cost =
    listing && listing.listingCostArray && listing.listingCostArray.length > 0 && listing.listingCostArray[0].cost;
  const max =
    (fixedQuantity !== -1 && fixedQuantity) ||
    (listing && listing.listingDetail && listing.listingDetail.inventoryCount);
  const listingOwned = (listing && listing.user && listing.user.id) === (currentUser && currentUser.id);
  const disabled = max <= 0 || listingOwned || !currentUser;
  const handleSubmit = async (redirect = false) => {
    if (!currentUser) {
      history.push(`${USER_ROUTES.login}?redirectBack=${history && history.location && history.location.pathname}`);
    }

    if ((currentUser && currentUser.id) === (listing && listing.user && listing.user.id)) {
      return message.error('Listing owned!');
    }

    const input = {
      consumerId: currentUser && currentUser.id,
      orderDetail: {
        vendorId: listing && listing.user && listing.user.id,
        modalName: 'listing',
        modalId: listing && listing.id,

        title: listing && listing.title,
        imageUrl: listing_img,
        cost: isDiscount ? parseInt(cost && (cost - cost * (discount / 100)).toFixed()) : parseInt(cost.toFixed(2)),
        orderOptions: {
          quantity: fixedQuantity === -1 ? 1 : fixedQuantity
        }
      }
    };

    try {
      // console.log('input', input);
      await addToCart(input);
      if (redirect) {
        history.push(`${ORDER_ROUTES.checkoutCart}`);
      }
    } catch (e) {
      message.error('Failed!');
      throw new Error(e);
    }

    // Add Message
    message.success('Success! Complete your Order.');
  };
  const bookmarkListing = async (id, userId) => {
    try {
      await props.addOrRemoveListingBookmark(id, userId);
    } catch (e) {
      throw Error(e);
    }
  };

  // console.log('loaded', loaded);

  const cardImg = (display = false) =>
    listing_img && (
      <img
        ref={ref}
        onLoad={onLoad}
        src={listing_img}
        style={{
          height: '100%',
          display: display && 'none'
        }}
      />
    );

  return (
    <>
      {cardImg(true)}
      {!loaded ? (
        <RelatedCardSkeleton />
      ) : (
        <ListingWraper style={componentStyle}>
          <IfLoggedIn>
            <BookmarkComponent
              handleBookmark={() => bookmarkListing(listing.id, currentUser.id)}
              listing={listing}
              currentUser={currentUser}
            />
          </IfLoggedIn>
          {listing_is_new && <NewLabel>{'New'}</NewLabel>}
          <div
            align="center"
            style={{
              padding: '20px',
              zIndex: 1,
              position: 'absolute',
              bottom: 0,
              width: '100%'
            }}
          >
            <AddToCartFormBtns
              title={
                !currentUser
                  ? 'SignIn To Continue'
                  : disabled
                  ? (max <= 0 && 'Out of Stock') || (listingOwned && 'Listing owned')
                  : 'Continue to Booking'
              }
              inCart={inCart}
              onSubmit={() => handleSubmit(false)}
              onDelete={onDelete}
              onSubmitRedirect={() => handleSubmit(true)}
              loading={loading}
              disabled={disabled}
              catalogueCard={true}
            />
          </div>
          <Link className="listing-link" to={`${ROUTES.listingDetailLink}${listing_id}`}>
            <Card
              bodyStyle={{ margin: '0px' }}
              hoverable
              cover={
                <div
                  style={{
                    overflow: 'hidden',
                    height: '230px',
                    borderRadius: '8px 8px 0px 0px'
                  }}
                  align="center"
                >
                  {cardImg()}
                </div>
              }
            >
              <Meta
                title={
                  <span
                    style={{
                      fontSize: '20px',
                      overflow: 'hidden',
                      lineClamp: 1,
                      display: 'box'
                    }}
                  >
                    {listing && listing.title}
                  </span>
                }
                description={
                  <Row style={{ height: '75px' }}>
                    <Col span={15}>
                      {/* <h4>&#8377;{cost} per day</h4> */}
                      {isDiscount && cost ? (
                        <>
                          <CurrencyDisplay
                            style={{ display: 'inline' }}
                            input={(cost - cost * (discount / 100)).toFixed(2)}
                          />
                          <CurrencyDisplay
                            input={cost.toFixed(2)}
                            valueStyle={{
                              textDecoration: 'line-through',
                              fontSize: '15px'
                            }}
                          />
                        </>
                      ) : (
                        cost && <CurrencyDisplay input={cost.toFixed(2)} />
                      )}
                    </Col>
                    {isDiscount && (
                      <Col align="right" span={9}>
                        <Statistic
                          title=""
                          precision={2}
                          valueStyle={{ color: '#cf1322' }}
                          value={discount && discount.toFixed(2)}
                          suffix={'%'}
                          prefix={<Icon type="ArrowDownOutlined" />}
                        />
                      </Col>
                    )}
                  </Row>
                }
              />
              <br />
              <br />
              <br />
              <br />
            </Card>
          </Link>
        </ListingWraper>
      )}
    </>
  );
};

RelatedCardComponent.propTypes = {
  listing: PropTypes.object.isRequired,
  history: PropTypes.object,
  componentStyle: PropTypes.object,
  addToCart: PropTypes.func,
  addOrRemoveListingBookmark: PropTypes.func,
  onDelete: PropTypes.func,
  currentUser: PropTypes.object,
  listingBookmarkStatus: PropTypes.bool,
  inCart: PropTypes.bool,
  loading: PropTypes.bool
};

export default compose(withAddToCart, withToogleListingBookmark)(RelatedCardComponent);
