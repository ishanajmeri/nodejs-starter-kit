import React from 'react';
import { History } from 'history';

import { TranslateFunction } from '@gqlapp/i18n-client-react';
import {
  Row,
  Icon,
  Col,
  PageLayout,
  Card,
  CardGroup,
  CardTitle,
  CardText,
  Button,
  Underline,
  MetaTags
} from '@gqlapp/look-client-react';

import LoginForm from './LoginForm.web';
// types
import { LoginUserInput } from '../../../../packages/server/__generated__/globalTypes';

interface LoginViewProps {
  t: TranslateFunction;
  history: History;
  hideModal: () => void;
  onSubmit: (values: LoginUserInput) => void;
  isRegistered: boolean;
}

const LoginView: React.FunctionComponent<LoginViewProps> = props => {
  const { onSubmit, t, isRegistered, hideModal, history } = props;
  const renderConfirmationModal = () => (
    <Card>
      <CardGroup style={{ textAlign: 'center' }}>
        <CardTitle>{t('reg.successRegTitle')}</CardTitle>
        <CardText>{t('reg.successRegBody')}</CardText>
        <CardText>
          <Button style={{ minWidth: '320px' }} color="primary" onClick={hideModal}>
            {t('login.form.btnSubmit')}
          </Button>
        </CardText>
      </CardGroup>
    </Card>
  );

  const renderContent = () => (
    <>
      {isRegistered ? (
        renderConfirmationModal()
      ) : (
        <Card className="form-card">
          <Underline>
            <CardTitle>
              <Icon type="LoginOutlined" /> &nbsp;
              {t('login.form.title')}
            </CardTitle>
          </Underline>
          <LoginForm onSubmit={onSubmit} history={history} />
          <hr />
          <Card>
            <CardGroup>
              <CardTitle>{t('login.cardTitle')}:</CardTitle>
              <CardText>admin@example.com:admin123</CardText>
              <CardText>user@example.com:user1234</CardText>
            </CardGroup>
          </Card>
        </Card>
      )}
    </>
  );

  return (
    <PageLayout type="forms">
      <MetaTags title={t('login.title')} description={t('login.meta')} />
      <Row>
        <Col lg={24} md={0} xs={0}>
          <br />
          <br />
        </Col>
      </Row>
      {renderContent()}
    </PageLayout>
  );
};

export default LoginView;
