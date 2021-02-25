const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const Tour = require("./tourmodel");
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


reviewSchema.index({tour:1,user:1},{unique:true})

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path:'tour',
  //   select:'name'
  // }).populate({
  //   path:'user',
  //   select:'name photo'
  // });
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

//static mnethods
reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage:4.5,
    });
  }
};
reviewSchema.post("save", function (next) {
  this.constructor.calculateAverageRatings(this.tour);
});

//Imp property
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function (next) {
  // this.r=await this.findOne();//Does Not Work Here Becoz query Is updated
  this.r.constructor.calculateAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
