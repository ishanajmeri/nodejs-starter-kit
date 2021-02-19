import React from 'react';

import { translate } from '@gqlapp/i18n-client-react';
import { Icon, MetaTags, PageLayout, Heading, Divider, Col, Row } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';
import { CategoryNavBarComponent } from '@gqlapp/category-client-react';
import { MODAL } from '@gqlapp/review-common';

import RenderCatalogue from './RenderCatalogue';
import RelatedCardComponent from './RelatedCardComponent';

// types
import { listing_listing as Listing } from '../graphql/__generated__/listing';
import { ListingsCatalogueProps } from '../containers/ListingCatalogue.web';

export interface ListingCatalogueViewProps extends ListingsCatalogueProps {
  title: string;
  onDelete?: (id: number) => void;
  emptyLink: string;
  showFilter: boolean;
}

const ListingCatalogueView: React.FC<ListingCatalogueViewProps> = props => {
  const {
    t,
    onLowerCostChange,
    onUpperCostChange,
    onCategoryChange,
    onFiltersRemove,
    onBrandChange,
    onSearchTextChange,
    onRoleChange,
    onIsActiveChange,
    onDiscountChange,
    onRatedChange,
    onOrderBy,
    loading,
    showFilter,
    listings,
    history,
    title,
    getCart,
    currentUser,
    cartLoading,
    onDelete,
    emptyLink,
    loadData
  } = props;

  const renderFunc = (key: number, listing: Listing) => {
    const cartItemArray =
      getCart && getCart.orderDetails && getCart.orderDetails.length > 0
        ? getCart.orderDetails.filter(oD => oD.modalId === listing.id)
        : [];
    return (
      <RelatedCardComponent
        key={key}
        listing={listing}
        history={history}
        modalName={MODAL[1].value}
        modalId={listing.id}
        currentUser={currentUser}
        inCart={cartItemArray.length === 0}
        loading={cartLoading}
        onDelete={() => onDelete(cartItemArray[0].id)}
      />
    );
  };

  return (
    <PageLayout>
      <MetaTags title={t('list.title')} description={`${settings.app.name} - ${t('list.meta')}`} />
      <CategoryNavBarComponent filter={{ isActive: true, isNavbar: true, modalName: MODAL[1].value }} />
      <Row type="flex" align="middle">
        <Col lg={12} md={12} xs={24}>
          <Heading type="2">
            <Icon type="SolutionOutlined" /> &nbsp; {title}
          </Heading>
        </Col>
        <Col lg={12} md={12} xs={0}>
          <Row justify="end">
            {listings && (
              <h4>{`(showing 1 - ${listings.edges.length} products of ${listings.totalCount} products)`}</h4>
            )}
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: '5px 0px 10px' }} />
      <RenderCatalogue
        loading={loading}
        showFilter={showFilter}
        layout={'vertical'}
        emptyLink={emptyLink}
        history={history}
        currentUser={currentUser}
        listings={listings}
        renderFunc={renderFunc}
        loadData={loadData}
        onDelete={onDelete}
        filterFuncs={{
          onLowerCostChange,
          onUpperCostChange,
          onCategoryChange,
          onFiltersRemove,
          onBrandChange,
          onSearchTextChange,
          onRoleChange,
          onIsActiveChange,
          onDiscountChange,
          onRatedChange,
          onOrderBy
        }}
        t={t}
      />
    </PageLayout>
  );
};

export default translate('listing')(ListingCatalogueView);
