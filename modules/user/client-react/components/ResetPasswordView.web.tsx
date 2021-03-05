import React from 'react';

import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { LayoutCenter, PageLayout, Heading, MetaTags, Row, Col } from '@gqlapp/look-client-react';

import ResetPasswordForm from './ResetPasswordForm.web';
// types
import { ResetPasswordInput } from '../../../../packages/server/__generated__/globalTypes';
interface ResetPasswordViewProps {
  t: TranslateFunction;
  onSubmit: (values: ResetPasswordInput) => void;
}

const ResetPasswordView: React.FunctionComponent<ResetPasswordViewProps> = props => {
  const { t, onSubmit } = props;
  const renderContent = () => (
    <>
      <Heading type="1">{t('resetPass.form.title')}</Heading>
      <ResetPasswordForm onSubmit={onSubmit} />
    </>
  );

  return (
    <PageLayout>
      <MetaTags title={t('resetPass.title')} description={t('resetPass.meta')} />
      <Row>
        <Col md={0} lg={0}>
          {renderContent()}
        </Col>
        <Col xs={0} md={24} lg={24}>
          <LayoutCenter>{renderContent()}</LayoutCenter>
        </Col>
      </Row>
    </PageLayout>
  );
};

export default ResetPasswordView;
