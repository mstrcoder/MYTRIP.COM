const express = require("express");
const fs = require("fs");
const Tour = require("./../models/tourmodel");
const app = express();
const morgan = require("morgan");
const API = require("./../utilities/apifeatures");
//used to add iddleware
app.use(express.json());

//creaing a middle ware for the top 5 cheapest Tour
exports.topfivecheapesttour = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,summary";
  next();
};

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

const GetAllTour = async (req, res) => {
  try {
    const features = new API(Tour.find(), req.query)
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Cannot get data",
    });
  }
};

const CreateNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      body: "added",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
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
};
const GetOneTour = async (req, res) => {
  try {
    const find = await Tour.findById(req.params.id);
    // console.log(find);
    // if(find.length==0)console.log("Galat hai!")
    res.status(200).json({
      status: "success",
      body: find,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Cannot get data",
    });
  }
  // console.log(req.params);
  // res.status(200).json({
  //     status: "success",
  //     body: tours[req.params.id],
  // });
};

const UpdateOneTour = async (req, res) => {
  try {
    const find = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // console.log(find);
    // if(find.length==0)console.log("Galat hai!")
    res.status(200).json({
      status: "success",
      body: find,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Cannot Update DATA",
    });
  }
};

const DeleteOneTour = async (req, res) => {
  try {
    const find = await Tour.findByIdAndDelete(req.params.id);
    // console.log(find);
    // if(find.length==0)console.log("Galat hai!")
    res.status(200).json({
      status: "success",
      body: find,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Cannot DELETE DATA",
    });
  }
};

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
          _id: '$difficulty',
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
        $sort:{
          avgPrice:1
        }
      }
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

exports.getMonthlyPlan=async (req,res) =>{
  try {
    const year=req.params.year*1;
    const plan=await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match:{
          startDates:{ 
            $gte: new Date(`${year}-01-01`),
            $lte:new Date(`${year}-12-31`) 
          }
        }
      },
      {
        $group:{
          _id:{ $month:'$startDates'},
          numTourStarts:{$sum:1},
          tours:{ $push:'$name'}
        }
      },
      {
        $addFields:{ month:'$_id'}
      },
      {
        $project:{_id:0}
      },
      {
        $sort:{numTourStarts:-1}
      }
      
    ])
    res.status(200).json({
      status: "success",
      body: plan,
    });
    // const stats = await Tour.aggregate([
    //   {
    //     $match: {
    //       ratingsAverage: {
    //         $gte: 4.5,
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: '$difficulty',
    //       numRatings: { $sum: "$ratingsQuantity" },
    //       num: { $sum: 1 },
    //       avgRating: {
    //         $avg: "$ratingsAverage",
    //       },
    //       avgPrice: {
    //         $avg: "$price",
    //       },
    //       minPrice: {
    //         $min: "$price",
    //       },
    //       maxPrice: {
    //         $avg: "$price",
    //       },
    //     },
    //   },
    //   {
    //     $sort:{
    //       avgPrice:1
    //     }
    //   }
    //   // ,
    //   // {
    //   //   $match: {
    //   //     _id:{$ne:'easy'}
    //   //   }
    //   // }
    // ]);
    // res.status(200).json({
    //   status: "success",
    //   body: stats,
    // });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Cannot GET DATA",
    });
  }
}
