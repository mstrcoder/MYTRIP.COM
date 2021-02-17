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
    const find = await Tour.find({});
    console.log(find);

    res.status(200).json({
      status: "success",
      body:find
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
const GetOneTour=async (req, res) => {
    try {
        const find = await Tour.findById(req.params.id);
        // console.log(find);
        // if(find.length==0)console.log("Galat hai!")
        res.status(200).json({
          status: "success",
          body:find
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
}

const UpdateOneTour = async (req, res) => {
    try {
        const find = await Tour.findByIdAndUpdate(req.params.id,req.body, {
            new:true
        });
        // console.log(find);
        // if(find.length==0)console.log("Galat hai!")
        res.status(200).json({
          status: "success",
          body:find
        });
      } catch (err) {
        res.status(400).json({
          status: "fail",
          message: 'Cannot Update DATA'
      })
    }  
}

const DeleteOneTour =async  (req, res) => {
    try {
        const find = await Tour.findByIdAndDelete(req.params.id);
        // console.log(find);
        // if(find.length==0)console.log("Galat hai!")
        res.status(200).json({
          status: "success",
          body:find
        }); 
      } catch (err) {
        res.status(400).json({
          status: "fail",
          message: 'Cannot DELETE DATA'
      })
    } 
};

exports.GetAllTour = GetAllTour;

exports.CreateNewTour = CreateNewTour;

exports.GetOneTour = GetOneTour;

exports.UpdateOneTour = UpdateOneTour;

exports.DeleteOneTour = DeleteOneTour;
