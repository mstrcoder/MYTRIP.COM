const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review Must belong to The Tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      //form where we need to refrence
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/,function (next){
  this.populate({
    path:'tour',
    select:'name'
  }).populate({
    path:'user',
    select:'name photo'
  });
  next();
})

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
