import React from 'react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';

import { Row, PageLayout, MetaTags, Card, Heading, Spinner } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

import DynamicCarouselFormComponent from './DynamicCarouselFormComponent';
// types
import { currentUser_currentUser } from '@gqlapp/user-client-react/graphql/__generated__/currentUser';
import { AddDynamicCarouselInput } from '../../../../../packages/server/__generated__/globalTypes';
import { AddDynamicCarouselProps } from '../../containers/DCComponents/AddDynamicCarousel';

interface AddDynamicCarouselViewProps extends AddDynamicCarouselProps {
  t: TranslateFunction;
  loading: boolean;
  onSubmit: (values: AddDynamicCarouselInput) => void;
  currentUser: currentUser_currentUser;
}

const AddDynamicCarouselView: React.FunctionComponent<AddDynamicCarouselViewProps> = props => {
  const { t, loading, onSubmit, currentUser } = props;
  return (
    <PageLayout type="forms">
      <MetaTags title={t('banner')} description={`${settings.app.name} - ${t('meta')}`} />

      {loading ? (
        <Spinner />
      ) : (
        <Row type="flex" justify="center">
          <Card
            title={
              <Heading type="1">
                <strong>{t('dynamicCarousel.addBanner')}</strong>
              </Heading>
            }
          >
            <DynamicCarouselFormComponent
              t={t}
              dynamicCarousel={{ isActive: true }}
              onSubmit={onSubmit}
              currentUser={currentUser}
            />
          </Card>
        </Row>
      )}
    </PageLayout>
  );
};

export default AddDynamicCarouselView;
