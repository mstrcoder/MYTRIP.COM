const mongoose = require('mongoose');
const TourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "A tour must have Name"],
      unique: true, 
    },
    duration:{  
        type:Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize:{
        type:String,
        required: [true, "A tour must have a GroupSize"]
    },
    difficulty:{
        type:String,
        required: [true, "A tour must have Difficulty"]
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
        type: Number,
        default:0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have price"],
    },
    priceDiscount:Number,
    summery:{
        type:String,
        trim:true
    },
    description:{
        type:String,
        trim:true
    }, 
    imageCover:{
        type:String,
        required: [true, "A tour must have a cover Image"]
    },
    image:[String],
    createdAt:{
        type:Date,
        default: Date.now()
    },
    startDates:[Date]
  });

const Tour = mongoose.model("Tour", TourSchema);
module.exports =Tour;