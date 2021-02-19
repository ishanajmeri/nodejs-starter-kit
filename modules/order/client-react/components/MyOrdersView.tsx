import React from 'react';

import {
  Icon,
  PageLayout,
  Heading,
  MetaTags,
  Row,
  Col,
  Divider,
  EmptyComponent,
  SuggestedListComponent,
  Spinner,
  Button,
  ButtonGroup
} from '@gqlapp/look-client-react';
import { LISTING_ROUTES } from '@gqlapp/listing-client-react';

import MyOrderItemComponent from './MyOrderItemComponent';
import { MyOrdersProps, MyOrdersContainerProps } from '../containers/MyOrder';

// types
import { order_order as Order } from '../graphql/__generated__/order';

export interface MyOrdersViewProps extends MyOrdersProps, MyOrdersContainerProps {
  //
}

const MyOrdersView: React.FC<MyOrdersViewProps> = props => {
  const [status, setStatus] = React.useState('');
  const { loading, orders, t, title, history, currentUser, orderStates, onUserStateChange } = props;

  function filterItems(e: string) {
    setStatus(e.toUpperCase());
    onUserStateChange(currentUser && currentUser.id, e);
  }

  function classNamesgroup(e: string) {
    if (status === e.toUpperCase()) {
      return 'primary';
    } else {
      return '';
    }
  }

  const renderFunc = (key: string, item: Order) => (
    <MyOrderItemComponent key={key} item={item} history={history} currentUser={currentUser} t={t} />
  );
  const Icons = [
    <Icon type="AppstoreOutlined" />,
    <Icon type="HddOutlined" />,
    <Icon type="CheckOutlined" />,
    <Icon type="ToTopOutlined" />,
    <Icon type="DeleteOutlined" />,
    <Icon type="ShopOutlined" />
  ];
  const RenderMyOrders = () => (
    <div>
      {!loading && (
        <SuggestedListComponent
          grid={{
            gutter: 24,
            xs: 1,
            sm: 1,
            md: 3,
            lg: 4,
            xl: 5,
            xxl: 5
          }}
          endText={'orders'}
          {...props}
          items={orders}
          renderFunc={renderFunc}
        />
      )}
    </div>
  );
  return (
    <PageLayout>
      <MetaTags title=" MyOrders" description="" />

      <Row>
        <Col lg={{ span: 8 }} md={{ span: 8 }} xs={{ span: 24 }}>
          <Heading type="2" className="headingTop">
            <Icon type={title.icon} />
            {title.text}
          </Heading>
          <br />
        </Col>
        <Col lg={0} md={0} xs={24} align="center">
          {orderStates && orderStates.length !== 0 && (
            <>
              <Button block onClick={() => filterItems('')} type={classNamesgroup('')}>
                {Icons[0]}
                ALL
              </Button>
              {orderStates.map((oS, i) => (
                <Button key={i} block onClick={() => filterItems(oS.state)} type={classNamesgroup(oS.state)}>
                  {Icons[i + 1]}
                  {oS.state}
                </Button>
              ))}
            </>
          )}
        </Col>
        <Col lg={{ span: 16 }} md={{ span: 24 }} xs={0} align="right">
          {orderStates && orderStates.length !== 0 && (
            <ButtonGroup>
              <Button onClick={() => filterItems('')} type={classNamesgroup('')}>
                {Icons[0]}
                ALL
              </Button>
              {orderStates.map((oS, i) => (
                <Button key={i} onClick={() => filterItems(oS.state)} type={classNamesgroup(oS.state)}>
                  {Icons[i + 1]}
                  {oS.state}
                </Button>
              ))}
            </ButtonGroup>
          )}
        </Col>
      </Row>
      <Divider />

      {loading && (
        <div style={{ height: '100vh', position: 'relative' }}>
          <Spinner />
        </div>
      )}
      {!loading &&
        (orders && orders.totalCount ? (
          <RenderMyOrders />
        ) : (
          !loading && (
            <div style={{ height: '100vh', position: 'relative' }}>
              <EmptyComponent description={t('noOrdersMsg')} emptyLink={`${LISTING_ROUTES.listingCatalogue}`} />
            </div>
          )
        ))}
    </PageLayout>
  );
};

export default MyOrdersView;
