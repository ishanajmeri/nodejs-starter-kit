import React, { Fragment } from 'react';
import Helmet from 'react-helmet';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { PageLayout, CatalogueWithInfiniteScroll, Row, Col, Spinner } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

import ProfileCatalogueCard from './components/ProfileCatalogueCard';
import { userList_userList as Users } from '../graphql/__generated__/userList';

const NoUserMessage = () => (
  <h2 className="text-center" style={{ textAlign: 'center' }}>
    No users to show
  </h2>
);

interface UsersProfileCatalogueViewProps {
  t: TranslateFunction;
  users: Users;
  loading: boolean;
  loadData: (endCursor: number, action: string) => void;
}

const UsersProfileCatalogueView: React.FunctionComponent<UsersProfileCatalogueViewProps> = props => {
  const { loading, users, t } = props;

  const RenderUserList = () => (
    <Fragment>
      <div>
        <UsersProfileListComponent {...props} />
      </div>
    </Fragment>
  );

  return (
    <PageLayout>
      {/* Render metadata */}
      <Helmet
        title={`${settings.app.name} - Users List`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('user.meta')}`
          }
        ]}
      />
      <h2 className="profile-catalogue-heading" style={{ fontSize: '32px', marginBottom: '24px' }}>
        <strong>All Users</strong>

        <div key="line" className="title-line-wrapper" align="left">
          <div
            className="title-line"
            // style={{ transform: "translateX(-64px)" }}
          />
        </div>
      </h2>
      <Row gutter={24}>
        <Col xs={24} md={18}>
          {/* Render loader */}
          {loading && <Spinner />}
          {/* Render main listing content */}
          {users && users.totalCount ? <RenderUserList /> : !loading ? <NoUserMessage /> : null}
        </Col>
      </Row>
    </PageLayout>
  );
};

interface UsersProfileListComponentProps extends UsersProfileCatalogueViewProps {}

const UsersProfileListComponent: React.FunctionComponent<UsersProfileListComponentProps> = props => {
  return (
    <div>
      <div>
        <CatalogueWithInfiniteScroll
          grid={{
            gutter: 24,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 3
          }}
          endMessage={'End Of Profiles'}
          loadData={props.loadData}
          component={ProfileCatalogueCard}
          list={props.users}
          loading={props.loading}
          hasMore={props.users.pageInfo.hasNextPage}
          endCursor={props.users.pageInfo.endCursor}
          totalCount={props.users.totalCount}
        />
      </div>
    </div>
  );
};

export default translate('listing')(UsersProfileCatalogueView);
