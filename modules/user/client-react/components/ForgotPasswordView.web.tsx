import React from 'react';

import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { PageLayout, Card, CardTitle, Icon, Heading, MetaTags, Row, Col } from '@gqlapp/look-client-react';

import ForgotPasswordForm from './ForgotPasswordForm.web';
// types
import { ForgotPasswordInput } from '../../../../packages/server/__generated__/globalTypes';

interface ForgotPasswordViewProps {
  t: TranslateFunction;
  sent: boolean;
  onSubmit: (values: ForgotPasswordInput) => void;
}

const ForgotPasswordView: React.FunctionComponent<ForgotPasswordViewProps> = props => {
  const { onSubmit, t, sent } = props;
  const renderContent = () => (
    <>
      <Card>
        <CardTitle>
          <Heading type="2">
            <Icon type="UndoOutlined" />
            {t('forgotPass.form.title')}
          </Heading>
        </CardTitle>
        <h1 className="text-center"></h1>
        <ForgotPasswordForm onSubmit={onSubmit} sent={sent} />
      </Card>
    </>
  );

  return (
    <PageLayout type="forms">
      <MetaTags title={t('forgotPass.title')} description={t('forgotPass.meta')} />
      <Row justify="center">
        <Col xs={24} lg={12}>
          <Col xs={24} md={24} lg={0}>
            <br />
            <br />
            <br />
            <br />
          </Col>
          <Col xs={0} md={0} lg={24}>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </Col>
          {renderContent()}
        </Col>
      </Row>
    </PageLayout>
  );
};

export default ForgotPasswordView;
