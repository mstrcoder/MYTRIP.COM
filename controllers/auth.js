const User = require("./../models/usermodel");
const catchAsync = require("./../utilities/asyncerror");
const jwt = require("jsonwebtoken");
const AppError = require("./../utilities/apperror");
const { promisify } = require("util");
const { decode } = require("querystring");
const Email = require("./../utilities/email");
const crypto = require("crypto");

//Generating JWT Token!
const signToken = (id) => {
  // create Cokkies After
  // res.cookies("jwt", token, {
  //   expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  //   secure: true,
  //   httpOnly: true,
  // });
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
  // console.log("hello");
  const newUser = await User.create(req.body);
  // console.log('created the user',newUser);
  const url = `${req.protocol}://${req.get("host")}/me`;
  await new Email(newUser, url).sendWelcome();
  const token = signToken(newUser._id);
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    // secure: true,
    httpOnly: true,
  });
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
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    // secure: true,
    httpOnly: true,
  });
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
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  res.locals.user = freshUser;

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

  // const resetURL = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/vi/users/resetPassword/${token}}`;

  // const message = `Forgot Your password ?Submit a PATCH request with your new Passowrd amd password Confirm to ${resetURL}.\n `;

  try {
    // console.log(resetURL,message);
    // await sendEmail({
    //   email: user.email,
    //   subject: "Your password Reset Token Valid for 10 min",
    //   message: message,
    // });
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/vi/users/resetPassword/${token}}`;
    await new Email(user, resetUrL).sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: "Token sent on email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There is was an  Error With This Email Address", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get USer BAsed On the Token

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // if token not expires and ther eis a User

  if (!user) {
    return next(new AppError("Token is Invalid or expired", 500));
  }

  // update Changed PAssword propety fopr the users
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //log the user in ,send JWt
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    // secure: true,
    httpOnly: true,
  });
  res.status(200).json({
    status: "Success!",
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //Get USer From Collection
  const user = await User.findById(req.user.id).select("+password");

  const correct = await user.correctPassword(
    req.body.passwordCurrent,
    user.password
  );

  //check id Posted Current Pasword is correctPassword
  if (!correct) {
    return next(new AppError("Your pAssword is not Correct", 401));
  }

  //update the Password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //log user in send JWT
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    // secure: true,
    httpOnly: true,
  });
  res.status(200).json({
    status: "Success!",
    token,
  });
});

exports.isLogeedIn = async (req, res, next) => {
  let token;
  // console.log(req.cookies.jwt);
  if (req.cookies.jwt) {
    try {
      token = req.cookies.jwt;
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
        return next();
      }
      //if user chenge password after JWT Tokens was issued
      if (!freshUser.changePasswordAfter(decoded.iat)) {
        return next();
      }

      //There is an Login User
      //this way we can store locally any thing PUG template can access to it
      res.locals.user = freshUser;

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.logout = (req, res, next) => {
  res.cookie("jwt", "loggesout", {
    expires: new Date(Date.now() + 10 * 1000),
    // secure: true,
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};

// exports.updateMe= catchAsync(async (req, res, next) => {
//   const user=await User.findByIdAndUpdate(
//       req.user.id,
//       {
//         name: req.body.name,
//         email: req.body.email,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(200).json({
//       status:'success',
//       body:user
//     })
// })
