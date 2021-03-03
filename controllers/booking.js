const User = require("./../models/usermodel");
const Tour = require("./../models/tourmodel");
const Booking = require("./../models/bookingmodel");
const catchAsync = require("./../utilities/asyncerror");
const AppError = require("./../utilities/apperror");
const stripe = require("stripe")(
  "sk_test_51IQENaC2RoBCLRqQAZPhdIqyGqAJjAX2C3M3TRGFYM6uZwN9gaSTWN1kwfCHKlC7W0ESGDgt9zz3oy2MoH61vyYh00sNFMlPaM"
);
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  console.log(tour);  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // success_url:`${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
        // images:
      },
    ],
  });
  console.log("Kya Baat hai"); 
  res.status(200).json({
    status: "Succcess",
    session,
  });
});

// exports.createBookingCheckout=catchAsync(async(req, res,next)=>{
//   ;
//     if(!tour&&!user&&!price)return next();
//   
//     res.redirect(req.originalUrl.split('?')[0])

// })

const createBookingCheckout=async (session)=>{
    const tour=session.client_reference_id;
   const user=(await User.findOne({email:session.customer_email})).id;
   const price=session.line_items[0].amount/100;
   console.log(tour,user,price);
    await  Booking.create({tour,user,price});
}
exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"]; 
  console.log("hogya hai !");
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      "whsec_Lml7hAY6t5vc25ZMdkwJBLBXFXmKV61h"
    );
  } catch (err) {
    res.status(400).send(`Webhook Error:${err.message}`);
  }
  console.log(event);
  if(event.type==='checkout.session.completed') {
      console.log("Bhayya Checkout session completed");
    createBookingCheckout(event.data.object)
  }
  res.status(200).json({received:true})
};
