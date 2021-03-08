import React, { useEffect } from 'react';
import { History } from 'history';
import { SubscribeToMoreOptions } from 'apollo-client';
import { Message } from '@gqlapp/look-client-react';

import { compose } from '@gqlapp/core-common';
import { ORDER_STATES } from '@gqlapp/order-common';
import { withCurrentUser } from '@gqlapp/user-client-react/containers/UserOperations';
import { translate } from '@gqlapp/i18n-client-react';

// import ORDER_PAYMENT from '../graphql/OrderPayment.graphql';
// import PATCH_ORDER_PAYMENT from '../graphql/PatchOrderPayment.graphql';

import ROUTES from '../routes';
import CheckoutOrderView from '../components/CheckoutOrderView';

import { withGetCart, withPatchOrderState } from './OrderOperations';
import { subscribeToCart } from './OrderSubscriptions';
// types
import { getCart_getCart as GetCart } from '@gqlapp/order-client-react/graphql/__generated__/getCart';

interface CheckoutOrderProps {
  history: History;
  subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
  getCart: GetCart;
  patchOrderState: (orderId: number, state: string) => Promise<{ v: boolean }>;
}

const CheckoutOrder: React.FunctionComponent<CheckoutOrderProps> = props => {
  const { history, patchOrderState, getCart, orderPayment, subscribeToMore } = props;

  useEffect(() => {
    const subscribe = subscribeToCart(subscribeToMore, getCart && getCart.id, history);
    return () => subscribe();
  });

  const openCheckout = () => {
    // Variables
    // props.orderPaymentRefetch();
    // const orderId = orderPayment.orderId;
    const amount = orderPayment.razorpayTransactionAmount;
    // const razorpayOrderId = orderPayment.razorpayOrderId;

    const options = {
      key: 'rzp_test_vmG2tbpGt4EDR2',
      key_secret: 'zOerAsWXjhWe9fr8i38F5g1X',
      amount, // 2000 paise = INR 20, amount in paisa
      currency: 'INR',
      name: 'Gems Premium',
      description: 'Payment for your order.',
      image:
        'https://res.cloudinary.com/approxyma/image/upload/v1596304728/rsz_logo_final-0-removebg-preview_biq5n2.png',
      // order_id: razorpayOrderId, //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
      handler: function handler(response) {
        // console.log(response);
        document.getElementById('razorpay_order_id').value = response.razorpay_order_id;
        document.getElementById('razorpay_payment_id').value = response.razorpay_payment_id;
        document.getElementById('razorpay_signature').value = response.razorpay_signature;
        document.getElementById('rp_button').click();
      },
      // prefill: {
      //   name: 'Harshil Mathur',
      //   email: 'harshil@razorpay.com'
      // },
      notes: {
        address: 'note value'
      },

      theme: {
        color: '#df0303'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  async function onSubmit(e) {
    e.preventDefault();

    // console.log('onSubmit Called!');
    // const razorpayOrderId = document.getElementById('razorpay_order_id').value;
    // const razorpaySignature = document.getElementById('razorpay_signature').value;
    // const razorpayPaymentId = document.getElementById('razorpay_payment_id').value;

    // Get Values
    // const finalObj = {
    //   id: props.orderPayment.id,
    //   razorpaySignature,
    //   razorpayPaymentId,
    //   razorpayOrderId,
    //   status: 'completed',
    // };
    // console.log('paymmmmmmm', finalObj);

    try {
      Message.destroy();
      Message.warning('Processing.');
      const output = await patchOrderState(getCart.id, ORDER_STATES.INITIATED);
      // console.log(output);
      if (output) {
        Message.destroy();
        Message.success(`State change to ${ORDER_STATES.INITIATED}`);
        if (history) {
          return history.push(`${ROUTES.myOrder}`);
        }
      }
    } catch (e) {
      Message.destroy();
      e.Message.replace('GraphQL error:', '');
      Message.error(e.Message.replace('GraphQL error:', ''));
      throw new Error(e);
    }
  }

  return (
    <>
      <CheckoutOrderView openCheckout={openCheckout} onSubmit={onSubmit} {...props} />
      {/* <div ref={el => (this.instance = el)} /> */}
      <form onSubmit={onSubmit} id="rp_custom" hidden>
        <input type="text" id="razorpay_order_id" />
        <input type="text" id="razorpay_signature" />
        <input type="text" id="razorpay_payment_id" />
        <input type="submit" id="rp_button" />
      </form>
    </>
  );
};

export default compose(
  withCurrentUser,
  withGetCart,
  // graphql(ORDER_PAYMENT, {
  //   props({ data: { loading, error, orderPayment, refetch } }) {
  //     if (error) throw new Error(error);
  //     // console.log(orderPayment);
  //     return { loading, orderPayment, orderPaymentRefetch: refetch };
  //   },
  // }),
  // graphql(PATCH_ORDER_PAYMENT, {
  //   props: ({ ownProps: { history, navigation }, mutate }) => ({
  //     patchOrderPayment: async values => {
  //       // console.log('mutation called in container', values);
  //       await mutate({
  //         variables: {
  //           input: values,
  //         },
  //       });
  //     },
  //   }),
  // }),

  withPatchOrderState,
  translate('order')
)(CheckoutOrder);
