import React from 'react';
import { History } from 'history';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import {
  Icon,
  Row,
  Col,
  PageLayout,
  Card,
  CardGroup,
  CardTitle,
  CardText,
  Underline,
  MetaTags
} from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

import RegisterForm from './RegisterForm.web';
// types
import { RegisterUserInput } from '../../../../packages/server/__generated__/globalTypes';

interface RegisterViewProps {
  t: TranslateFunction;
  history: History;
  location: Location;
  onSubmit: (values: RegisterUserInput) => void;
  isRegistered: boolean;
}

const RegisterView: React.FunctionComponent<RegisterViewProps> = props => {
  const { t, onSubmit, isRegistered, location, history } = props;
  if (isRegistered && !settings.auth.password.requireEmailConfirmation && location.href.includes('?redirectBack=')) {
    const pushUrl = location.href.split('?redirectBack=')[1];
    history.push(pushUrl);
  }

  const renderConfirmationModal = () => (
    <Card>
      <CardGroup style={{ textAlign: 'center' }}>
        <CardTitle>{t('reg.confirmationMsgTitle')}</CardTitle>
        <CardText>{t('reg.confirmationMsgBody')}</CardText>
      </CardGroup>
    </Card>
  );

  const renderContent = () => (
    <Card className="form-card">
      <Underline>
        <CardTitle>
          <Icon type="UserAddOutlined" /> {t('reg.form.title')}
        </CardTitle>
      </Underline>
      <br />
      {isRegistered && settings.auth.password.requireEmailConfirmation ? (
        renderConfirmationModal()
      ) : (
        <RegisterForm onSubmit={onSubmit} />
      )}
    </Card>
  );

  return (
    <PageLayout type="forms">
      <MetaTags title={t('reg.title')} description={t('reg.meta')} />
      <br />
      <Row>
        <Col lg={24} md={0} xs={0}>
          <br />
          <br />
          <br />
        </Col>
      </Row>
      {renderContent()}
    </PageLayout>
  );
};

export default translate('user')(RegisterView);
