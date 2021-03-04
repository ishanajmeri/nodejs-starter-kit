import React from 'react';
import { NavLink } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';

import { translate } from '@gqlapp/i18n-client-react';
import {
  MetaTags,
  PageLayout,
  Row,
  Col,
  Text,
  Badge,
  Divider,
  BreadcrumbItem,
  Breadcrumb,
  Spinner,
  Icon
} from '@gqlapp/look-client-react';
import { IfLoggedIn } from '@gqlapp/user-client-react';
import AddToCart from '@gqlapp/order-client-react/containers/AddToCart';
import { Review, ReviewStar } from '@gqlapp/review-client-react';
import { DiscountComponent } from '@gqlapp/discount-client-react';
import { ListingShareMessage } from '@gqlapp/listing-common';
import { HOME_ROUTES } from '@gqlapp/home-client-react';
import { MODAL } from '@gqlapp/review-common';

import ROUTES from '../routes';
import ListingCarousel from './ListingCarousel';
import ListingDetailImgCarousel from './ListingDetailImgCarousel';
import BookmarkComponent from './BookmarkComponent';
import SocialSharingButtons from './SocialSharingButtons';
import { displayDataCheck } from './functions';

// types
import { ListingDetailProps } from '../containers/ListingDetail';
import { ShareListingByEmailInput } from '../../../../packages/server/__generated__/globalTypes';
import { listing_listing_listingMedia as ListingMedia } from '../graphql/__generated__/listing';

export interface ListingDetailViewProps extends ListingDetailProps {
  onDelete: (id: number) => void;
  onShare: (values: ShareListingByEmailInput) => void;
  handleBookmark: (id: number, userId: number) => void;
}

const ListingDetailView: React.FC<ListingDetailViewProps> = props => {
  const { listing, loading, history, currentUser, handleBookmark, t, onShare, canUserReview } = props;

  const isDiscount = listing && listing.listingFlags && listing.listingFlags.isDiscount;
  // const discount =
  //   listing && listing.listingCostArray && listing.listingCostArray.length > 0 && listing.listingCostArray[0].discount;
  const cost =
    listing && listing.listingCostArray && listing.listingCostArray.length > 0 && listing.listingCostArray[0].cost;
  // const inventoryCount = listing && listing.listingDetail && listing.listingDetail.inventoryCount;
  const images: ListingMedia[] =
    listing &&
    listing.listingMedia &&
    listing.listingMedia.length > 0 &&
    listing.listingMedia.filter(lM => lM.type === 'image');
  const youtubeUrl: ListingMedia[] =
    listing &&
    listing.listingMedia &&
    listing.listingMedia.length > 0 &&
    listing.listingMedia.filter(lM => lM.type === 'video');

  const message: {
    whatsappMessage: string;
    twitterMessage: {
      text: string;
      hashtag: string;
      link: string;
    };
    link: string;
    emailMessage: string;
  } = listing && ListingShareMessage(listing.id, listing.user.username, listing.title);
  const listingCarousleProps = {
    filter: { userId: listing && listing.user.id },
    onFilter: c => c.node.user.id === listing.user.id,
    currentUser,
    title: 'Similar Listing (same user)',
    alignTitle: 'left',
    history,
    // style={{ backgroundColor: 'white' }},
    ...props
  };
  return (
    <PageLayout>
      <MetaTags title={t('listingDetail.title')} description={t('listingDetail.meta')} />
      {!loading && !listing && (
        <div align="center">
          <br />
          <br />
          <br />
          <h3>{'Listing not found!'}</h3>
        </div>
      )}
      {loading && <Spinner />}
      {!loading && listing && (
        <>
          <div
            style={{
              background: 'white',
              margin: '0 -200%',
              padding: '0 200%'
            }}
          >
            <br />
            <Row gutter={[24, 24]}>
              <Col lg={11} md={11} xs={0}>
                <StickyContainer style={{ height: '100%' /* , zIndex: '1' */ }}>
                  <Sticky>
                    {({ style, isSticky }: { isSticky: boolean; style: object }) => (
                      <div style={{ ...style }}>
                        <div style={{ height: isSticky ? '60px' : '0px' }} />
                        <ListingDetailImgCarousel images={images} youtubeUrl={youtubeUrl} carouselLayout={false} />
                        <Divider />
                        <AddToCart
                          listing={listing}
                          history={history}
                          currentUser={currentUser}
                          modalId={listing && listing.id}
                          modalName={MODAL[1].value}
                          // catalogueCard={true}
                        />
                      </div>
                    )}
                  </Sticky>
                </StickyContainer>
              </Col>
              <Col lg={0} md={0} xs={24}>
                <ListingDetailImgCarousel images={images} youtubeUrl={youtubeUrl} carouselLayout={false} />
                <Divider />
                <AddToCart
                  listing={listing}
                  history={history}
                  currentUser={currentUser}
                  modalId={listing && listing.id}
                  modalName={MODAL[1].value}
                  // catalogueCard={true}
                />
              </Col>
              <Col lg={13} md={13} xs={24}>
                <Row /*  type="flex" align="end" */>
                  <Col lg={22} md={22} xs={21}>
                    <Breadcrumb separator=">">
                      <BreadcrumbItem key="home">
                        <NavLink to={`${HOME_ROUTES.home}`}>
                          <Icon type="HomeOutlined" />
                        </NavLink>
                      </BreadcrumbItem>
                      <BreadcrumbItem key="listing-title">
                        <NavLink to={`${ROUTES.categoryCatalogueLink}${listing.category.id}`}>
                          {listing && displayDataCheck(listing.category.title)}
                        </NavLink>
                      </BreadcrumbItem>
                      <BreadcrumbItem key="listing-title">{displayDataCheck(listing.title)}</BreadcrumbItem>
                    </Breadcrumb>
                    <Col span={24}>
                      <h2 style={{ marginBottom: '0px' }}>{listing.title}</h2>
                      <div style={{ display: 'flex' }}>
                        <h4>&nbsp;{listing.user.username}</h4> &nbsp;
                        <h4>&nbsp;{listing.brand}</h4>
                      </div>
                      {isDiscount && <Text type="success">Special Price</Text>}
                      <Row>
                        <Col span={15}>
                          <DiscountComponent modalId={listing && listing.id} modalName={MODAL[1].value} cost={cost} />
                        </Col>
                      </Row>
                      <ReviewStar
                        suffix="reviews"
                        filter={{
                          isActive: true,
                          modalId: listing && listing.id,
                          modalName: MODAL[1].value
                        }}
                      />
                    </Col>
                  </Col>
                  <Col lg={2} md={2} xs={3}>
                    <Row>
                      <Col lg={12} xs={24} align="right">
                        {currentUser && (
                          <IfLoggedIn>
                            {/* <div style={{ marginTop: '4px' }}> */}
                            <BookmarkComponent
                              handleBookmark={() => handleBookmark(listing.id, listing.user.id)}
                              listing={listing}
                              right={'12%'}
                            />
                            {/* </div> */}
                          </IfLoggedIn>
                        )}
                      </Col>
                      <Col md={0} xs={24}>
                        <br />
                      </Col>
                      <Col lg={12} xs={24} align="right">
                        <SocialSharingButtons onShare={onShare} t={t} {...message} />
                      </Col>
                    </Row>
                  </Col>

                  <Col span={24}>
                    <br />
                    <Row gutter={24}>
                      <Col lg={6} md={6} xs={24}>
                        <Icon type="SafetyOutlined" /> &nbsp;
                        <Text type="secondary">Availability</Text>
                      </Col>
                      <Col lg={{ span: 18, offset: 0 }} md={{ span: 18, offset: 0 }} xs={{ span: 24, offset: 2 }}>
                        {listing.listingDetail.inventoryCount > 0 && <Text type="success">In Stock &nbsp;</Text>}
                        {listing.listingDetail.inventoryCount > 0 && listing.listingDetail.inventoryCount < 10 && (
                          <Text type="warning">Only {listing.listingDetail.inventoryCount} left</Text>
                        )}
                        {listing.listingDetail.inventoryCount <= 0 && <Text type="danger">Out Of Stock</Text>}
                      </Col>
                    </Row>
                    <div style={{ paddingTop: '5px' }} />
                    <Row gutter={24}>
                      <Col lg={6} md={6} xs={24}>
                        <Icon type="MenuOutlined" /> &nbsp;
                        <Text type="secondary">Highlights</Text>
                      </Col>
                      <Col lg={{ span: 18, offset: 0 }} md={{ span: 18, offset: 0 }} xs={{ span: 24, offset: 2 }}>
                        {listing &&
                          listing.listingHighlight &&
                          listing.listingHighlight.length > 0 &&
                          listing.listingHighlight.map(lH => (
                            <>
                              <Badge status="default" text={lH.highlight} />
                              <br />
                            </>
                          ))}
                      </Col>
                    </Row>
                    <div style={{ paddingTop: '5px' }} />
                    <Row gutter={24}>
                      <Col lg={6} md={6} xs={24}>
                        <Icon type="DownSquareOutlined" /> &nbsp;
                        <Text type="secondary">Description</Text>
                      </Col>
                      <Col lg={{ span: 18, offset: 0 }} md={{ span: 18, offset: 0 }} xs={{ span: 24, offset: 2 }}>
                        <Text status="default">{listing.description}</Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Divider />
                <Review
                  listing={{
                    title: listing.title,
                    img: images[0]
                  }}
                  filter={{
                    isActive: true,
                    modalId: listing && listing.id,
                    modalName: MODAL[1].value
                  }}
                  showAdd={canUserReview}
                  currentUser={currentUser}
                  t={t}
                />
              </Col>
            </Row>
            <br />
            <br />
            <br />
          </div>
          <ListingCarousel {...listingCarousleProps} />
        </>
      )}
    </PageLayout>
  );
};

export default translate('listing')(ListingDetailView);
