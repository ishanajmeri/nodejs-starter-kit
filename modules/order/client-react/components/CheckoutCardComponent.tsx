import React from 'react';
import styled from 'styled-components';

import { NextButton, Col, Row, Card, Divider, RenderSelect, Option, Icon, Space } from '@gqlapp/look-client-react';
import { FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { MODAL } from '@gqlapp/review-common';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { displayDataCheck, SocialSharingButtons } from '@gqlapp/listing-client-react';
import { IfLoggedIn } from '@gqlapp/user-client-react';
import { UserRoleObject } from '@gqlapp/user-common/';
import { OrderShareMessage } from '@gqlapp/order-common/SocialSharingMessage';
// import { SocialSharingButtons } from '@gqlapp/listing-client-react/components/SocialSharingButtons'
import CartItemComponent from './CartItemComponent';
import { TotalPrice } from './function';

// types
import { order_order as Order } from '../graphql/__generated__/order';
import { orderStates_orderStates } from '../graphql/__generated__/orderStates';
import OrderStatusMail from '../containers/OrderStatusMail';
import { ORDER_STATES } from '@gqlapp/order-common';

const StatusText = styled.div`
  color: ${props => props.status === 'completed' && '#2aa952'};
  color: ${props => props.status === 'initiated' && '#F79E1B'};
  color: ${props => props.status === 'cancelled' && 'red'};
`;

export interface CheckoutCardComponentProps {
  order: Order;
  SubmitButton?: JSX.Element;
  product: number;
  showBtn: boolean;
  orderStates: orderStates_orderStates[];
  btnDisabled: boolean;
  onPatchOrderState: (orderId: number, state: string) => void;
  onSubmit?: () => void;
  buttonText: string;
  showState: boolean;
  t: TranslateFunction;
}

const CheckoutCardComponent: React.FC<CheckoutCardComponentProps> = props => {
  const {
    order,
    SubmitButton,
    product,
    showBtn,
    btnDisabled,
    orderStates,
    onSubmit,
    onPatchOrderState,
    buttonText,
    showState,
    t
  } = props;
  const message: {
    whatsappMessage: string;
    twitterMessage: {
      text: string;
      hashtag: string;
      link: string;
    };
    link: string;
    emailMessage: string;
  } = order && OrderShareMessage(order.id, 'order.user.username', 'order.title');
  const Icons = [
    <Icon type="AppstoreOutlined" />,
    <Icon type="HddOutlined" />,
    <Icon type="CheckOutlined" />,
    <Icon type="ToTopOutlined" />,
    <Icon type="DeleteOutlined" />,
    <Icon type="ShopOutlined" />
  ];
  return (
    <Card align="left" style={{ height: '100%' }}>
      <Row>
        <Col span={6}>
          <h3 className="OrderHead">{t('checkoutCard.orderSummary')}</h3>
        </Col>
        {showState && (
          <Col span={18}>
            <Row>
              <Col lg={22} align="right">
                <IfLoggedIn
                  role={UserRoleObject.admin}
                  elseComponent={
                    <h3>
                      <StatusText status={order.orderState && order.orderState.state.toLowerCase()}>
                        {order.orderState && displayDataCheck(order.orderState.state)}
                      </StatusText>
                    </h3>
                  }
                >
                  <Space align="center">
                    <div align="left">
                      {orderStates && orderStates.length !== 0 && (
                        <Field
                          name="Order state"
                          icon={'AimOutlined'}
                          component={RenderSelect}
                          placeholder={t('orders.column.state')}
                          defaultValue={order.orderState.state}
                          onChange={(e: string) => onPatchOrderState(order.id, e)}
                          label={t('orders.column.state')}
                          style={{ width: '100px' }}
                          value={order.orderState.state}
                          inFilter={true}
                          noBotMarging={true}
                          selectStyle={{ width: '100%' }}
                        >
                          {orderStates.map((oS, i) => (
                            <Option key={i + 2} value={oS.state}>
                              {Icons[i + 1]} &nbsp;
                              {oS.state}
                            </Option>
                          ))}
                        </Field>
                      )}
                    </div>
                    <OrderStatusMail orderId={order.id} disabled={order.orderState.state !== ORDER_STATES.DISPATCHED} />
                  </Space>
                </IfLoggedIn>
              </Col>
              <Col lg={2} align="right">
                <div style={{ paddingTop: '5px' }}>
                  <SocialSharingButtons /* onShare={onShare} */ t={t} {...message} />
                </div>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
      <br />
      <hr />
      <br />
      <div style={{ maxHeight: '365px', overflow: 'hidden', overflowY: 'auto' }}>
        {order &&
          order.orderDetails &&
          order.orderDetails.length !== 0 &&
          order.orderDetails.map((item, key) => (
            <Row>
              <Col span={24}>
                <CartItemComponent
                  inner={true}
                  key={key}
                  item={item}
                  t={t}
                  state={order.orderState && order.orderState.state}
                  modalName={MODAL[1].value}
                  modalId={item.modalId}
                />
                <Divider />
              </Col>
            </Row>
          ))}
      </div>
      <hr />
      <br />
      <h3 className="OrderHead">
        <u>{t('checkoutCard.cartSummary')}</u>
      </h3>
      {/* {paid === true ? (
          <h3 className="lightText">
            Total amount{' '}
            <strong className="rightfloat">
              &#8377;
              {` ${TotalPrice(order && order.orderDetails.length !== 0 && order.orderDetails)}`}
            </strong>
          </h3>
        ) : ( */}
      <br />
      <div style={{ lineHeight: '12px' }}>
        <h3 className="rentAmount">
          {t('checkoutCard.total')}
          <h2 style={{ float: 'right' }}>
            &#8377;
            {` ${displayDataCheck(TotalPrice(order && order.orderDetails.length !== 0 && order.orderDetails))}`}
          </h2>
        </h3>
      </div>
      {/* )} */}
      {order.paid === true ? (
        <h4 className="lightText">
          {t('checkoutCard.youPaid')}
          <strong className="colorFloat"> &#8377; {TotalPrice(order)}</strong>
          <h6 className="PaidMethodColor">{displayDataCheck(product.youPaid.method)}</h6>
        </h4>
      ) : null}
      <br />
      <div align="right">
        {showBtn &&
          (SubmitButton ? (
            <SubmitButton />
          ) : (
            <NextButton onClick={onSubmit} disabled={btnDisabled} size="lg">
              {displayDataCheck(buttonText)}
            </NextButton>
          ))}
      </div>
    </Card>
  );
};

export default CheckoutCardComponent;
