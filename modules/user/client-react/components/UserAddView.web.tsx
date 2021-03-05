import React from 'react';
import { Link } from 'react-router-dom';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { Card, PageLayout, Heading, MetaTags } from '@gqlapp/look-client-react';

import ROUTES from '../routes';
import UserForm from './UserForm.web';
// types
import { EditUserInput } from '../../../../packages/server/__generated__/globalTypes';

interface UserAddViewProps {
  onSubmit: (values: EditUserInput) => void;
  t: TranslateFunction;
}

const UserAddView: React.FunctionComponent<UserAddViewProps> = props => {
  const { t, onSubmit } = props;
  const renderContent = () => (
    <Card className="form-card">
      <Link to={`${ROUTES.adminPanel}`}>Back</Link>
      <Heading type="2">
        {t('userEdit.form.titleCreate')} {t('userEdit.form.title')}
      </Heading>
      <UserForm onSubmit={onSubmit} initialValues={{}} shouldDisplayRole={true} shouldDisplayActive={true} />
    </Card>
  );

  return (
    <PageLayout type="forms">
      <MetaTags title={t('userAdd.title')} description={t('userAdd.meta')} />
      {renderContent()}
    </PageLayout>
  );
};

export default translate('user')(UserAddView);
