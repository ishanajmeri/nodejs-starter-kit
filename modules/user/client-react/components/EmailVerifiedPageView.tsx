import React from 'react';
import { History } from 'history';

import { PageLayout, Icon, Row, Col, Button, Result, MetaTags } from '@gqlapp/look-client-react';
import { HOME_ROUTES } from '@gqlapp/home-client-react';
import { USER_ROUTES } from '@gqlapp/user-client-react';
import settings from '@gqlapp/config';

const EMAIL_VERIFIED_GIF = 'https://media.tenor.com/images/90170b1a23f28719c66f43fc435bf076/tenor.gif';

interface EmailVerifiedPageViewProps {
  history: History;
}

const EmailVerifiedPageView: React.FunctionComponent<EmailVerifiedPageViewProps> = props => {
  const { history } = props;
  return (
    <PageLayout>
      <MetaTags title={'Email Verified'} description={`${settings.app.name} - Email Verified}`} />
      <div align="center">
        <Row>
          <Col xs={0} sm={0} md={24} lg={24}>
            <br />
            <br />
          </Col>
          <Col xs={24} sm={24} md={0} lg={0}>
            <br />
          </Col>
        </Row>
        <Result
          icon={
            <Row type="flex">
              <Col xs={0} sm={0} md={24} lg={24} align="center">
                <img src={EMAIL_VERIFIED_GIF} height="200px" />
              </Col>
              <Col span={24} md={0} lg={0} align="center">
                <img src={EMAIL_VERIFIED_GIF} height="100px" />
              </Col>
            </Row>
          }
          title={
            <>
              <Row justify="center">
                <Col lg={24} md={24} sm={24} xs={0}>
                  Email Verification Successfully
                </Col>
                <Col lg={0} md={0} xs={24}>
                  Verification
                </Col>
                <Col lg={0} md={0} xs={24}>
                  Successfully
                </Col>
              </Row>
            </>
          }
          subTitle="It is a pleasure to have you here. Continue to Login!"
          extra={
            <>
              <Row justify="center">
                <Col lg={{ span: 12 }}>
                  <Row type="flex" justify="center" gutter={[24, 24]}>
                    <Col xs={24} sm={24} md={24} lg={12}>
                      <Row justify="center">
                        <Button
                          color="primary"
                          block={true}
                          key="console"
                          onClick={() => history.push(`${HOME_ROUTES.home}`)}
                        >
                          <Icon type="HomeOutlined" /> Go To Home
                        </Button>
                      </Row>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12}>
                      <div style={{ width: '100%' }}>
                        <Button key="signIn" block={true} onClick={() => history.push(`${USER_ROUTES.login}`)}>
                          <Icon type="LoginOutlined" />
                          Sign In
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          }
        />
      </div>
    </PageLayout>
  );
};

export default EmailVerifiedPageView;
