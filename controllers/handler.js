const catchAsync = require("./../utilities/asyncerror");
const AppError = require("./../utilities/apperror");
const API = require("./../utilities/apifeatures");


exports.deleteOneTour = (Model) =>
  catchAsync(async (req, res, next) => {
    const find = await Model.findByIdAndDelete(req.params.id);
    // console.log(find);
    // if(find.length==0)console.log("Galat hai!")
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.getOne = (Model, pop) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (pop) query = query.populate(pop);
    const find = await query;
    //used Populates for refrencing the data form guides which has the ID of User
    // console.log("bhayya");
    // console.log(find);
    if (!find) {
      // console.log("Error is here ");
      return next(new AppError("No Tour Find", 404));
    }
    // console.log(find);
    // if(find.length==0)console.log("Galat hai!")
    res.status(200).json({
      status: "success",
      body: find,
    });
    // console.log(req.params);
    // res.status(200).json({
    //     status: "success",
    //     body: tours[req.params.id],
    // });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // try {
    const features = new API(Model.find(), req.query)
      .sorting()
      .fields()
      .pagination();
    // features.filter();
    // features.sorting();
    // features.fields();
    // features.pagination();

    const find = await features.query;
    res.status(200).json({
      status: "success",
      body: find,
    });
    // }
    // catch (err) {
    //   res.status(400).json({
    //     status: "fail",
    //     message: "Cannot get data",
    //   });
    // }
  });
