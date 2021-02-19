import * as React from 'react';
import { History } from 'history';

import { EmptyComponent, Spinner, SuggestedListComponent, Col, Row } from '@gqlapp/look-client-react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';

import ListingFilterComponent from './ListingFilterComponent.web';

// types
import { listing_listing as Listing } from '../graphql/__generated__/listing';
import { listings_listings as Listings } from '../graphql/__generated__/listings';
import { currentUser_currentUser as CurrentUser } from '@gqlapp/user-client-react/graphql/__generated__/currentUser';
import { FilterListInput, OrderByListInput } from '../../../../packages/server/__generated__/globalTypes';

export interface RenderCatalogueProps {
  loading: boolean;
  showFilter: boolean;
  layout: string;
  emptyLink: string;
  history: History;
  currentUser: CurrentUser;
  listings: Listings;
  // onFiltersRemove: (filter: FilterListInput, orderBy: OrderByListInput) => void;
  filterFuncs: object;
  renderFunc: (key: number, listing: Listing) => JSX.Element;
  loadData: (endCursor: number, action: string) => { data: { listings: Listings } };
  onDelete: (id: number) => void;
  t: TranslateFunction;
}

const RenderCatalogue: React.FC<RenderCatalogueProps> = props => {
  const { t, showFilter, renderFunc, loadData, layout, loading, listings, emptyLink, filterFuncs } = props;
  const span =
    layout === 'vertical'
      ? {
          spanFilter: { lg: 6, md: 8, sm: 24 },
          spanContent: { lg: 18, md: 16, sm: 24 }
        }
      : {
          spanFilter: { span: 24 },
          spanContent: { span: 24 }
        };

  const RenderListings = () => (
    <div>
      <SuggestedListComponent
        endText={'listing'}
        grid={
          layout === 'vertical' && {
            gutter: 18,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 4
          }
        }
        items={listings}
        renderFunc={renderFunc}
        loadData={loadData}
      />
    </div>
  );
  return (
    <Row type="flex" gutter={[24, 24]}>
      <Col {...span.spanFilter}>
        {layout !== 'vertical' && <br />}
        {showFilter && (
          <ListingFilterComponent
            showIsActive={false}
            filter={{ isActive: true }}
            orderBy={{}}
            {...filterFuncs}
            {...props}
          />
        )}
      </Col>
      <Col {...span.spanContent}>
        {loading && <Spinner />}
        {!loading && listings && listings.totalCount ? (
          <RenderListings />
        ) : !loading ? (
          <EmptyComponent description={t('listing.noListingsMsg')} emptyLink={emptyLink} />
        ) : null}
      </Col>
    </Row>
  );
};

export default RenderCatalogue;
