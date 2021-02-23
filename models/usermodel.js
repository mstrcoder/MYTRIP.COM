const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const UserSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "Please Tell Your name"],
  },
  email: {
    type: "string",
    required: [true, "Please Tell Your email"],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, "Please provide valid Email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: "string",
    required: [true, "Please provide a valid password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide the Password"],
    //custom validator
    validate: {
      //this is the only works on Create  SAVE
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

UserSchema.pre("save", async function (next) {
  //is modified is function
  if (!this.isModified("password")) return next();

  //   console.log("password is modified");
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  //   console.log(this.name,this.passwordChangedAt);
  next();
});
//it is run when new Document is saved
UserSchema.pre("save", async function (next) {
  //is modified is function
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
UserSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
//this is and instance so it is availbale on all the doucuments
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changePasswordAfter = async function (JWTTimestamp) {
  console.log(this.passwordChangedAt);

  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimeStamp,JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
  // return await bcrypt.compare(candidatePassword,userPassword);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
