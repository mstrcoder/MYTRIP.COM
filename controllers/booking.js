const User = require("./../models/usermodel");
const Tour = require("./../models/tourmodel");
const Booking = require("./../models/bookingmodel");
const catchAsync = require("./../utilities/asyncerror");
const AppError = require("./../utilities/apperror");
const stripe = require('stripe')('sk_test_51IQENaC2RoBCLRqQAZPhdIqyGqAJjAX2C3M3TRGFYM6uZwN9gaSTWN1kwfCHKlC7W0ESGDgt9zz3oy2MoH61vyYh00sNFMlPaM');
exports.getCheckoutSession=catchAsync(async(req,res,next)=>{
    const tour=await Tour.findById(req.params.tourId);
    // console.log(tour);
    const session =await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourId,
        line_items:[
            {
                name:`${tour.name} Tour`,
                description:tour.summary,
                amount:tour.price*100,
                currency:'usd',
                quantity:1
                // images:
            }
        ]
    })

    res.status(200).json({
        status:'Succcess',
        session
    })

})

exports.createBookingCheckout=catchAsync(async(req, res,next)=>{
    const {tour,user,price}=req.query;
    if(!tour&&!user&&!price)return next();
    await  Booking.create({tour,user,price});
    res.redirect(req.originalUrl.split('?')[0])

})