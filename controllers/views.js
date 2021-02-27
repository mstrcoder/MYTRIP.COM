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
const Auth = require('./auth');

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
