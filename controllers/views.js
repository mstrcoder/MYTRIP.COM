const catchAsync = require("./../utilities/asyncerror");
const AppError = require("./../utilities/apperror");
const API = require("./../utilities/apifeatures");
const Tour = require("./../models/tourmodel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { decode } = require("querystring");
const sendEmail = require("./../utilities/email");
const crypto = require("crypto");
const User = require("./../models/usermodel");
const Auth = require("./auth");
const Booking=require("./../models/bookingmodel")

const signToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    "hello-bhayya-kese-ho-aap",
    {
      expiresIn: "90d",
    }
  );
};

exports.getOverview = catchAsync(async (req, res, next) => {
  console.log("HELLO11111");
  const features = new API(Tour.find(), req.query)
    .sorting()
    .fields()
    .pagination();

  const tours = await features.query;
  res.status(200).render("overview", { tours: tours });
});
exports.getTour = catchAsync(async (req, res, next) => {
  // '5c88fa8cf4afda39709c2955'
  // const {name}=req.params.id;
  let query = Tour.findOne({ slug: req.params.id });
  tour = await query.populate("reviews");
  // console.log(tour,tour[0]);
  if (!tour) {
    return next(new AppError("No Tour Find", 404));
  }
  res.status(200).render("tour", { tour: tour });
});
exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login");
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  const correct = await user.correctPassword(password, user.password);
  if (!user || !correct) {
    return next(new AppError("Incorrect Email and Password", 401));
  }
  const token = signToken(user._id);
  const features = new API(Tour.find(), req.query)
    .sorting()
    .fields()
    .pagination();

  const tours = await features.query;
  res.status(200).render("overview", { tours: tours });
});
exports.signup = catchAsync(async (req, res, next) => {
  res.status(200).render("signup");
  // const { email, password } = req.body;

  // const user = await User.findOne({ email }).select("+password");
  // const correct = await user.correctPassword(password, user.password);
  // if (!user || !correct) {
  //   return next(new AppError("Incorrect Email and Password", 401));
  // }
  // const token = signToken(user._id);
  // const features = new API(Tour.find(), req.query)
  //   .sorting()
  //   .fields()
  //   .pagination();

  // const tours = await features.query;
  // res.status(200).render("overview", { tours: tours });
});
exports.getAccount = (req, res) => {
  console.log("get Account page!");
  res.status(200).render("account", {
    title: "Your Account",
  });
};
exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log('My BODY',req.body);
  // const updateduser = await User.findByIdAndUpdate(
  //   req.user.id,
  //   {
  //     name: req.body.name,
  //     email: req.body.email,
  //   },
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );

  // res.status(200).render("account", {
  //   title: "Your Account",
  //   user:updateduser
  // });
});
exports.getMyTour=catchAsync(async (req, res, next) => {
  const booking=await Booking.find({user:req.user.id});
  // console.log('booking is done',booking); 
  const tourIDs=booking.map(el=>el.tour)
  const tours=await Tour.find({_id:{$in:tourIDs}});
  console.log(tours);
  res.status(200).render('overview',{
    title:'My tours',
    tours
  })



});
