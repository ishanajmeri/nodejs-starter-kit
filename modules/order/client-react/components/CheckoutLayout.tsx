import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { EmptyComponent, AddButton, Heading, Row, Col } from '@gqlapp/look-client-react';
import { LISTING_ROUTES } from '@gqlapp/listing-client-react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';

import CheckoutStepsComponent from './CheckoutStepsComponent';

const CustomBody = styled.div`
  background: white;
  padding: 0 24px;
  min-height: 80vh;
`;

interface CheckoutLayoutProps {
  t: TranslateFunction;
  cartLoading?: boolean;
  loading: boolean;
  title: string;
  step: number;
  Col1: JSX.Element;
  Col2: JSX.Element;
  extra?: JSX.Element;
}

const CheckoutLayout: React.FunctionComponent<CheckoutLayoutProps> = props => {
  const { cartLoading, loading, t, title, extra, step, Col1, Col2 } = props;
  return loading ? (
    <>
      <Row type="flex">
        <Col span={24} align="center">
          <CheckoutStepsComponent step={step} t={t} />
        </Col>
        <Col span={24}>
          <CustomBody>
            <br />
            <Row>
              <Col lg={12} md={12} xs={24}>
                <Heading>{title}</Heading>
              </Col>
              <Col lg={12} md={12} xs={24}>
                {extra}
              </Col>
            </Row>
            <br />
            <Row gutter={24}>
              <Col xxl={16} lg={16} xs={24}>
                {Col1}
                <br />
                <Link className="listing-link" to={`${LISTING_ROUTES.listingCatalogue}`} target="_blank">
                  <AddButton ghost block>
                    Continue Shopping
                  </AddButton>
                </Link>
              </Col>
              <Col lg={8} sm={24} xs={24}>
                {Col2}
              </Col>
            </Row>
            <br />
            <br />
            <br />
          </CustomBody>
        </Col>
      </Row>
    </>
  ) : (
    !cartLoading && (
      <div style={{ height: '100vh', position: 'relative' }}>
        <EmptyComponent
          description={'You have no items in your Cart'}
          emptyLink={`${LISTING_ROUTES.listingCatalogue}`}
          showAddBtn={true}
          btnText={t('checkoutCart.btn.add')}
        />
      </div>
    )
  );
};

export default CheckoutLayout;
