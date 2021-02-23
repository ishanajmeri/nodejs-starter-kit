import React from 'react';

import { Row, Col, Heading, Icon, PageLayout, Spinner, MetaTags } from '@gqlapp/look-client-react';
import { Review } from '@gqlapp/review-client-react';
import { MODAL } from '@gqlapp/review-common';

import RelatedCardComponent from './RelatedCardComponent';
// types
import { ListingReviewProps } from '../containers/ListingReview';

interface ListingReviewViewProps extends ListingReviewProps {
  onDelete: (id: number) => void;
}

const ListingReviewView: React.FunctionComponent<ListingReviewViewProps> = props => {
  const { loading, cartLoading, t, onDelete, history, getCart, listing, canUserReview, currentUser } = props;
  const cartItemArray =
    getCart && getCart.orderDetails && getCart.orderDetails.length > 0
      ? getCart.orderDetails.filter(oD => oD.modalId === listing.id)
      : [];

  return (
    <PageLayout>
      <MetaTags title={t('listingReview.title')} description={t('listingReview.meta')} />
      <Heading type="2">
        <Icon type="BookOutlined" /> &nbsp; All Review
      </Heading>
      {loading && <Spinner />}
      {!loading && (
        <Row gutter={40}>
          <Col lg={6}>
            <RelatedCardComponent
              listing={listing}
              history={history}
              modalName={'listing'}
              modalId={listing.id}
              currentUser={currentUser}
              inCart={cartItemArray.length === 0}
              loading={cartLoading}
              onDelete={() => onDelete(cartItemArray[0].id)}
            />
          </Col>
          <Col lg={18}>
            {listing && (
              <Review
                filter={{
                  isActive: true,
                  modalId: listing && listing.id,
                  modalName: MODAL[1].value
                }}
                showAdd={canUserReview}
                currentUser={currentUser}
                t={t}
              />
            )}
          </Col>
        </Row>
      )}
    </PageLayout>
  );
};

export default ListingReviewView;
