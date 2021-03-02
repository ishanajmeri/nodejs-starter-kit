// eslint-disable-next-line import/no-named-default
import { default as ORDER_ROUTES } from '@gqlapp/order-client-react/routes';

// eslint-disable-next-line import/prefer-default-export
export function OrderShareMessage(id: number, username: string, title: string) {
  const link = typeof window !== 'undefined' && window.location.origin;
  const orderLink = `${link}${ORDER_ROUTES.orderDetailLink}${id}`;

  const whatsappMessage = `Hey, check out this order - ${title} by ${username}, you can check it here ${orderLink}. Checkout other orders at ${link}.`;
  const twitterMessage = {
    text: `Hey, check out this order - ${title} by ${username},`,
    hashtag: '#nodejs',
    link: orderLink
  };
  const emailMessage = `Hey, I have put my order - ${title}, you can check it here <a href="${orderLink}">${orderLink}</a>. Checkout other orders at <a href="${link}">${link}</a>.`;
  return { whatsappMessage, twitterMessage, link: orderLink, emailMessage };
}
