import React from 'react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';

import { Row, PageLayout, MetaTags, Card, Heading, Spinner } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

import DynamicCarouselFormComponent from './DynamicCarouselFormComponent';
// types
import { EditDynamicCarouselInput } from '../../../../../packages/server/__generated__/globalTypes';
import { AddDynamicCarouselProps } from '../../containers/DCComponents/AddDynamicCarousel';

interface AddDynamicCarouselViewProps extends AddDynamicCarouselProps {
  onSubmit: (values: EditDynamicCarouselInput) => void;
}

const AddDynamicCarouselView: React.FunctionComponent<AddDynamicCarouselViewProps> = props => {
  const { t, loading, onSubmit } = props;
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
            <DynamicCarouselFormComponent t={t} onSubmit={onSubmit} />
          </Card>
        </Row>
      )}
    </PageLayout>
  );
};

export default AddDynamicCarouselView;
