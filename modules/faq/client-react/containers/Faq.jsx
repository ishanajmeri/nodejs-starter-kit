import React, { useEffect } from 'react';
import { compose } from '@gqlapp/core-common';
import PropTypes from 'prop-types';

import FaqView from '../components/FaqView';
import {
  withCardFaqList,
  withFaqState,
  withFilterUpdating,
  updateFaqsState,
  withOrderByUpdating
} from './FaqOperations';
import { useFaqWithSubscription } from './withSubscription';

const Faq = props => {
  const { updateQuery, subscribeToMore } = props;
  const filter = {};
  const faqsUpdated = useFaqWithSubscription(subscribeToMore, filter);

  useEffect(() => {
    if (faqsUpdated) {
      updateFaqsState(faqsUpdated, updateQuery);
    }
  });
  return <FaqView {...props} />;
};

// return <h1>Faqs</h1>
Faq.propTypes = {
  t: PropTypes.func,
  updateQuery: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  faqs: PropTypes.object,
  subscribeToMore: PropTypes.func.isRequired,
  filter: PropTypes.object
};

export default compose(withFaqState, withCardFaqList, withFilterUpdating, withOrderByUpdating)(Faq);
