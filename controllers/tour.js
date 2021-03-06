const express = require("express");
const fs = require("fs");
const Tour = require("./../models/tourmodel");
const app = express();
const morgan = require("morgan");
const API = require("./../utilities/apifeatures");
const catchAsync = require("./../utilities/asyncerror");
const AppError = require("./../utilities/apperror");
const handler = require("./handler");
const multer = require('multer');
//used to add iddleware
app.use(express.json());
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  //upload file are image or not
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not An Image ! Please Upload only Images", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
//creaing a middle ware for the top 5 cheapest Tour
exports.topfivecheapesttour = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,summary";
  next();
};

exports.uploadTourImages=upload.fields([
  {name:'imageCover',maxCount:1},
  {name:'images',maxCount:3}
])


exports.resizeTourImages=async (req,res,next)=>{
  if(!req.files.imageCover||!req.files.images)return next();
  //Cover Image
  const imageCoverFilename=`tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.file.imageCover[0].buffer)
  .resize(2000, 1333)
  .toFormat("jpeg")
  .jpeg({ quality: 90 })
  .toFile(`public/img/tours/${imageCoverFilename}`);
  req.body.imageCover=imageCoverFilename;

  //IMAGES
  req.body.images=[];
  await Promise.all(req.files.images.map(async (file,i) => {
    const filename=`tour-${req.params.id}-${Date.now()}-${i+1}.jpeg`;
    await sharp(file.buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${filename}`);
    req.body.images.push(filename)
  }));
  next();
}
// upload.single('image')
// upload.array('images',5)

///creating own middle ware

// app.use((req,res,next)=>{
// console.log("hello form the  iddle ware");
// next();
// })

//creating the middle ware with the help of Morgan
// app.use(morgan("dev"));
// const tours = JSON.parse(
//   fs.readFileSync("./starter/dev-data/data/tours-simple.json", "utf-8")
// );

const GetAllTour = handler.getAll(Tour);
// console.log(GetAllTour);
// const GetAllTour = catchAsync(async (req, res,next) => {
//   // try {
//     const features = new API(Tour.find(), req.query)
//       .sorting()
//       .fields()
//       .pagination();
//     // features.filter();
//     // features.sorting();
//     // features.fields();
//     // features.pagination();

//     const find = await features.query;
//     res.status(200).json({
//       status: "success",
//       body: find,
//     });
//   // }
//   // catch (err) {
//   //   res.status(400).json({
//   //     status: "fail",
//   //     message: "Cannot get data",
//   //   });
//   // }
// });
const CreateNewTour = catchAsync(
  async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      body: "added",
    });

    // catch (err) {
    //   res.status(400).json({
    //     status: "fail",
    //     message: err,
    //   });
  }

  // console.log(req.body);
  // const newid = tours[tours.length - 1].id + 1;

  // // console.log(newid);
  // const newTour = Object.assign({
  //     id: newid
  // }, req.body);
  // console.log(newTour);
  // tours.push(newTour);
  // fs.writeFile(
  //     "./starter/dev-data/data/tours-simple.json",
  //     JSON.stringify(tours),
  //     (err) => {

  //     }
  // );
  //   res.send("DONE");

  // res.status(200).send("Posted the data")
);

const GetOneTour = handler.getOne(Tour, { path: "reviews" });

// const GetOneTour =  catchAsync(async (req, res,next) => {

//     const find = await Tour.findById(req.params.id).populate('reviews')
//     //used Populates for refrencing the data form guides which has the ID of User
//     // console.log("bhayya");
//     // console.log(find);
//     if(!find)
//     {
//       // console.log("Error is here ");
//       return next(new AppError('No Tour Find',404))
//     }
//     // console.log(find);
//     // if(find.length==0)console.log("Galat hai!")
//     res.status(200).json({
//       status: "success",
//       body: find,
//     });
//   // console.log(req.params);
//   // res.status(200).json({
//   //     status: "success",
//   //     body: tours[req.params.id],
//   // });
// });

const UpdateOneTour = catchAsync(async (req, res, next) => {
  const find = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // console.log(find);
  // if(find.length==0)console.log("Galat hai!")
  res.status(200).json({
    status: "success",
    body: find,
  });
});

const DeleteOneTour = handler.deleteOneTour(Tour);
// const DeleteOneTour = catchAsync(async (req, res,next) => {

//   const find = await Tour.findByIdAndDelete(req.params.id);
//   // console.log(find);
//   // if(find.length==0)console.log("Galat hai!")
//   res.status(204).json({
//     status: "success",
//     data:null
//   });

// });

exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, lanlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? distance / 3936.2 : distance / 6378.1;
  if (!lat || lng)
    next(
      new AppError(
        "Please provide latitutde and Longitutde in the format lat,lng"
      ),
      400
    );

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results:tours.length,
    data: {
      data: tours,
    },
  });
});
exports.GetAllTour = GetAllTour;

exports.CreateNewTour = CreateNewTour;

exports.GetOneTour = GetOneTour;

exports.UpdateOneTour = UpdateOneTour;

exports.DeleteOneTour = DeleteOneTour;

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: {
            $gte: 4.5,
          },
        },
      },
      {
        $group: {
          _id: "$difficulty",
          numRatings: { $sum: "$ratingsQuantity" },
          num: { $sum: 1 },
          avgRating: {
            $avg: "$ratingsAverage",
          },
          avgPrice: {
            $avg: "$price",
          },
          minPrice: {
            $min: "$price",
          },
          maxPrice: {
            $avg: "$price",
          },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
      // ,
      // {
      //   $match: {
      //     _id:{$ne:'easy'}
      //   }
      // }
    ]);
    res.status(200).json({
      status: "success",
      body: stats,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Cannot Retrive  DATA",
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);
    res.status(200).json({
      status: "success",
      body: plan,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Cannot GET DATA",
    });
  }
};
