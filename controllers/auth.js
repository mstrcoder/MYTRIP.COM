const User = require("./../models/usermodel");
const catchAsync = require("./../utilities/asyncerror");
const jwt = require("jsonwebtoken");
const AppError = require("./../utilities/apperror");
const { promisify } = require("util");
const { decode } = require("querystring");
const sendEmail = require('./../utilities/email');

//Generating JWT Token!
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

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const token = signToken(newUser._id);
  //   newUser.save();
  res.status(201).json({
    status: "Success!",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //if email and password actually exist
  if (!email || !password) {
    return next(
      new AppError("Please provide The valid email and Password", 400)
    );
  }
  //this is used to select the password of the coreesponding email
  const user = await User.findOne({ email }).select("+password");

  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError("Incorrect Email and Password", 401));
  }
  //   console.log(user)

  //check if user exist &&password correctly

  //if everything ok,send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "Success!",
    token,
  });
  const newUser = await User.find(req.body);
  //   newUser.save();
  if (!newUser) {
    return next(new AppError("No User Found", 404));
  }
  res.status(201).json({
    status: "Success!",
    data: {
      user: newUser,
    },
  });
});

//it is a middleware which will forst tell is all users are authinticated or not if yes then only it will allow to getAll tours

exports.protect = catchAsync(async (req, res, next) => {
  //1) getting the token check it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not Logged In please login", 401));
  }
  // console.log(token);

  //Verification the Token and
  const decoded = await promisify(jwt.verify)(
    token,
    "hello-bhayya-kese-ho-aap"
  );

  // console.log(decoded);

  // Check if user still Exist
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError("No Longer User Exist", 401));
  }
  //if user chenge password after JWT Tokens was issued
  if (!freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently Changed Password!Please Log In Again", 401)
    );
  }

  req.user = freshUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array  [admin,leadguide]
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have Presmission To Do this", 401));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //GET user Email on posted will
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is No User With This Email Address", 404));
  }
  //generate Random Reset Token and
  const token = user.createPasswordResetToken();
//   console.log(token);
  //why validte beforesave becase then it ewill require password and all stufff
  await user.save({ validateBeforeSave: false });

  //send it at email

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/vi/users/resetPassword/${token}}`;

  const message=`Forgot Your password ?Submit a PATCH request with your new Passowrd amd password Confirm to ${resetURL}.\n `;

  try{

    // console.log(resetURL,message);
    await sendEmail({
        email:user.email,
        subject:'Your password Reset Token Valid for 10 min',
        message:message
    })
  
    res.status(200).json({
        status:'success', 
        message:'Token sent on email!'
    })
  }catch (err) {
      user.passwordResetToken=undefined;
      user.passwordResetExpires=undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError("There is was an  Error With This Email Address", 500));
  }

});

exports.resetPassword = (req, res, next) => {};
