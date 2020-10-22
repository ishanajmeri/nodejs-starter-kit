import React from 'react';
import { Spin } from 'antd';
import { PropTypes } from 'prop-types';

import { PageLayout, MetaTags } from '@gqlapp/look-client-react';

import FaqFormComponent from './FaqFormComponent.web';

const EditFaqView = ({ t, faq, editFaq, loading, faqLoading, currentUser, refetch }) => {
  const [flag, setflag] = React.useState(true);

  React.useEffect(() => {
    setflag(false);
  }, []);

  return (
    <>
      <PageLayout type="forms">
        <MetaTags title="Edit FAQ" description="Edit FAQ Description" />{' '}
        {!flag && !loading && !faqLoading ? (
          <>
            <div style={{ maxWidth: '600px', width: '100%' }}>
              <FaqFormComponent
                cardTitle="Edit Faq"
                t={t}
                faq={faq}
                isAdminShow={true}
                onSubmit={editFaq}
                currentUser={currentUser}
                refetch={refetch}
              />
            </div>
          </>
        ) : (
          <Spin />
        )}
      </PageLayout>
    </>
  );
};

EditFaqView.propTypes = {
  t: PropTypes.func,
  loading: PropTypes.bool,
  faq: PropTypes.object,
  currentUser: PropTypes.object,
  deleteAdmin: PropTypes.func,
  editFaq: PropTypes.func,
  faqLoading: PropTypes.bool,
  refetch: PropTypes.object
};

export default EditFaqView;
