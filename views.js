const express = require("express");
const views= require("./controllers/views");
const router = express.Router();
const Auth= require("./controllers/auth");
const booking= require("./controllers/booking");
// router.use(Auth.isLogeedIn);
router.get("/", booking.createBookingCheckout,Auth.isLogeedIn,views.getOverview);
router.get("/tour/:id", Auth.isLogeedIn,views.getTour);
router.get("/login",Auth.isLogeedIn, views.login);
router.get("/signup",Auth.isLogeedIn, views.signup);
router.get("/me", Auth.protect,views.getAccount);
router.get("/my-tours", Auth.protect,views.getMyTour);
router.get('/tour/review/:tourId',Auth.isLogeedIn,views.writeReview)
// router.get("/my-tours", Auth.protect,views.getMyTour);

router.post('/submit-user-data',Auth.protect,views.updateUserData)
module.exports = router;
