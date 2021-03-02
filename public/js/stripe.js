import axios from "axios";
import {showAlert} from './alert'
const stripe = Stripe(
  "pk_test_51IQENaC2RoBCLRqQ4MVfgxJcM4txL3KR7sv45FRqmwqsjTUIRogAlUVLEli8KVWdLQxg1wBv3WkNc9JJi87dKFkQ00RH2N1AA8"
);

export const bookTour1 = async (tourId) => {
  // console.log(tourID);
  try {
    const session = await axios(
      `/bookings/checkout-session/${tourId}`
    );
        // console.log(session.data);
    await stripe.redirectToCheckout({
        sessionId:session.data.session.id
    })
  } catch (err) {
    // console.log(err);
    showAlert('error',err)
  }
};
