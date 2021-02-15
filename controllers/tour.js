const express = require("express");
const fs = require("fs");
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
const tours = JSON.parse(
  fs.readFileSync("./starter/dev-data/data/tours-simple.json", "utf-8")
);

const GetAllTour=(req, res) => {
    console.log(tours);
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours,
        },
    });
}

const CreateNewTour= (req, res) => {
    console.log(req.body);
    const newid = tours[tours.length - 1].id + 1;
    // console.log(newid);
    const newTour = Object.assign({
        id: newid
    }, req.body);
    console.log(newTour);
    tours.push(newTour);
    fs.writeFile(
        "./starter/dev-data/data/tours-simple.json",
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: "success",
                bode: "added",
            });
        }
    );
    //   res.send("DONE");

    // res.status(200).send("Posted the data")
}

const GetOneTour=(req, res) => {
    console.log(req.params);
    res.status(200).json({
        status: "success",
        body: tours[req.params.id],
    });
}

const UpdateOneTour= (req, res) => {
    console.log(req.params);
    res.status(200).json({
        status: "success",
        body: tours[req.params.id],
    });
}

const DeleteOneTour= (req, res) => {
    console.log(req.params);
    res.status(200).json({
        status: "success",
        body: tours[req.params.id],
    });
}


exports.GetAllTour=GetAllTour;

exports.CreateNewTour=CreateNewTour;

exports.GetOneTour=GetOneTour;

exports.UpdateOneTour=UpdateOneTour;

exports.DeleteOneTour=DeleteOneTour;