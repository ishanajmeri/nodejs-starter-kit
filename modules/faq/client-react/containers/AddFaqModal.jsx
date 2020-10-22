import React from 'react';
import PropTypes from 'prop-types';
import { message, Button, Modal } from 'antd';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';
import { translate } from '@gqlapp/i18n-client-react';

// import USERS_QUERY from '@gqlapp/user-client-react/graphql/UsersQuery.graphql';
import ADD_FAQ from '../graphql/AddFaq.graphql';

import FaqFormComponent from '../components/FaqFormComponent.web';

const AddFaq = ({ buttonText, addFaq, currentUser }) => {
  const [visible, setvisible] = React.useState(false);

  const showModal = () => {
    setvisible(true);
  };

  const onSubmit = async values => {
    try {
      addFaq(values);
      setvisible(false);
    } catch (e) {
      return e;
    }
  };
  return (
    <>
      <Button icon="plus" onClick={showModal}>
        {buttonText}
      </Button>
      <Modal visible={visible} closable={false} footer={null}>
        <FaqFormComponent cardTitle="Add Faq" onSubmit={onSubmit} currentUser={currentUser} />
      </Modal>
    </>
  );
};
AddFaq.propTypes = {
  buttonText: PropTypes.string,
  addFaq: PropTypes.func,
  currentUser: PropTypes.object
};

export default compose(
  graphql(ADD_FAQ, {
    props: ({ mutate }) => ({
      addFaq: async values => {
        message.destroy();
        message.loading('Please wait...', 0);
        try {
          await mutate({
            variables: {
              input: values
            },
            optimisticResponse: {
              __typename: 'Mutation',
              addFaq: {
                __typename: 'Faq',
                // id: null,
                ...values
              }
            }
          });

          message.destroy();
          message.success('Faq added.');
        } catch (e) {
          message.destroy();
          message.error("Couldn't perform the action");
          console.error(e);
        }
      }
    })
  }),
  // graphql(USERS_QUERY, {
  //   options: ({ orderBy, filter }) => {
  //     return {
  //       fetchPolicy: 'network-only',
  //       variables: { orderBy, filter }
  //     };
  //   },
  //   props({
  //     data: { loading, users, refetch, error, updateQuery, subscribeToMore }
  //   }) {
  //     return {
  //       loading,
  //       users,
  //       refetch,
  //       subscribeToMore,
  //       updateQuery,
  //       errors: error ? error.graphQLErrors : null
  //     };
  //   }
  // }),
  translate('faq')
)(AddFaq);
