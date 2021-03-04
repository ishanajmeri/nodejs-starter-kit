import React from 'react';

import { MetaTags, Row, PageLayout, Card, Heading, Spinner } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

import DynamicCarouselFormComponent from './DynamicCarouselFormComponent';
// types
import { EditDynamicCarouselInput } from '../../../../../packages/server/__generated__/globalTypes';
import { EditDynamicCarouselProps } from '../../containers/DCComponents/EditDynamicCarousel';

interface EditDynamicCarouselViewProps extends EditDynamicCarouselProps {
  onSubmit: (values: EditDynamicCarouselInput) => void;
}

const EditDynamicCarouselView: React.FunctionComponent<EditDynamicCarouselViewProps> = props => {
  const { t, dynamicCarousel, loading, onSubmit } = props;

  return (
    <PageLayout type="forms">
      <MetaTags title={t('banner')} description={`${settings.app.name} - ${t('meta')}`} />
      <br />
      <br />
      <br />
      {loading ? (
        <Spinner />
      ) : (
        <Row type="flex" justify="center">
          {dynamicCarousel ? (
            <Card
              title={
                <Heading type="1">
                  <strong>{t('dynamicCarousel.editBanner')}</strong>
                </Heading>
              }
            >
              <DynamicCarouselFormComponent t={t} dynamicCarousel={dynamicCarousel} onSubmit={onSubmit} />
            </Card>
          ) : (
            <Spinner size="small" />
          )}
        </Row>
      )}
    </PageLayout>
  );
};

export default EditDynamicCarouselView;
