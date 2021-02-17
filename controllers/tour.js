const express = require("express");
const fs = require("fs");
const Tour = require("./../models/tourmodel");
const app = express();
const morgan = require("morgan");
//used to add iddleware
app.use(express.json());

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
    // we need a hard copy of that object to do this we do strucutring becoz if we do not do this then it will be normally referece of the onject
    //Filtering
    const queryObj = { ...req.query };
    const exclude = ["fields", "page", "sort", "limit"];
    exclude.forEach((el) => delete queryObj[el]);
    // console.log(req.query);
    // const find1=await Tour.find(req.query);
    // console.log(find1);




    //Advanced Filtering like adding GTE and LTE with $ sign
    let queryStr = JSON.stringify(queryObj);
    quertStr = queryStr.replace(/\bgte|gt|lte|lt\b/g, (match) => {
      `$${match}`;
    });
    // console.log(JSON.parse(queryStr));



   let query = Tour.find(JSON.parse(queryStr));
    // console.log(find);



    //SORTING
    if (req.query.sort) {
      const sortBy=req.query.sort.split(',').join(' ');
      query=query.sort(sortBy);

      //sort('price raitngAverage)
    }else
    {
      query=query.sort('-createdAt');
    }


    // FIELD LIMITATION
    if(req.query.fields)
    {
      console.log("hello");
      const fields=req.query.fields.split(',').join(' ');
      console.log(fields);
      query=query.select(fields)

    }
    else{
      query=query.select('-__v')
    }
    // console.log(query);


    //PAGINATION


    const page=req.query.page*1 || 1;const limit=req.query.limit*1 ||100;
    const skip=(page-1)*limit;
    query=query.skip(skip).limit(limit);


    if(req.query.page){
      const numTours=await Tour.countDocuments();
      if(skip>numTours)throw new Error('This Page Not Exist');
    }



   






    const find = await query;
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
