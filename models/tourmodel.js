const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User=require('./usermodel')
const TourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have Name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name Must have less or equal to 40 character"],
      minlength: [4, "A tour name Must have atleast 4 character"],
      validate: [validator.isAlpha, "Name Should be Alphabet Only"]
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: String,
      required: [true, "A tour must have a GroupSize"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have Difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating Must Be above 0 "],
      max: [5, "Rating Must be less than or equal to 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only poiunts to current doc non New document Creation
          return val < this.price;
        },
        message: "Disocunt price ({VALUE}) should be below regular price",
      },
    },
    summery: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover Image"],
    },
    image: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },//this will create an embedded data//dereferencing
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day:String
      },
    ],
    guides:[{
      //this is referencing in Mongoose
      // type:Array,
      type:mongoose.Schema.ObjectId,
      //form where we need to refrence
      ref:'User'
    }]

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});


//virtual populate
TourSchema.virtual('reviews',{
    ref:'Review', 
    //it represent where the Tourmodel is saved in child data in this ex it saved as tour
    foreignField: 'tour',
    localField: '_id'


})

//DOCUMENT MIDDLEWARE works on .save and .create
TourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//executed after all middleware executed
// TourSchema.post("save", function (doc,next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
//   });

//Querey Middleware

TourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//Aggregration Middleqware
TourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

//Populates Middleware
TourSchema.pre(/^find/, function (next) {
  console.log("get Guides!!!");
  this.populate({
    path:'guides',
    select:'-__v -passwordChangedAt'
  });
  next();
});


//it is responsible for performing Embeding
// TourSchema.pre("save", async function (next) {
//   console.log("Hello Brother");
//   //will return array of promises 
//     const guidesPromises=this.guides.map(async id =>await User.findById(id));
//     //this is the way we resolve all the promises
//     this.guides=await Promise.all(guidesPromises)
//   next();
// });

const Tour = mongoose.model("Tour", TourSchema);
module.exports = Tour;

//4 types of middle ware in mongoose
