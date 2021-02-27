const catchAsync = require("./../utilities/asyncerror");
const AppError = require("./../utilities/apperror");
const API = require("./../utilities/apifeatures");
const Tour = require("./../models/tourmodel");

exports.getOverview=catchAsync(async (req, res, next) => {
  const features = new API(Tour.find(), req.query)
    .sorting()
    .fields()
    .pagination();
  
  const tours = await features.query;
  res.status(200).render("overview",{tours:tours});

 
})
exports.getTour=catchAsync(async (req, res, next) => {
  // '5c88fa8cf4afda39709c2955'
  // const {name}=req.params.id;
  let query =  Tour.findOne({slug:req.params.id})
  tour = await query.populate('reviews');
  // console.log(tour,tour[0]);
  if (!tour) {
    return next(new AppError("No Tour Find", 404));
  }
    res.status(200).render("tour", {tour:tour});

});