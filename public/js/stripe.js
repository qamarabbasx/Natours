/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51LHCFLDxuxUBQHNrrpqttprQ1PwBdYZmXxNOrD5ky9NKJmji6O4US01BqmKjp27TUVfhgOmkDKYoYnnjG9W1Bafn00DgWaE4Qo'
);
export const bookTour = async (tourId) => {
  try {
    // 1) get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) create checkout form and charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
