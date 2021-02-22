const express = require("express");
const fs = require("fs");
const app = express();
const morgan = require("morgan");
const tour = require("./controllers/tour");
const user = require("./controllers/user");
const querystring = require("querystring");
const AppError=require('./utilities/apperror')
// const {GetAllTour,CreateNewTour,GetOneTour,UpdateOneTour,DeleteOneTour} = require('./tour');
//used to add iddleware
app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`));
app
  .route("/api/v1/tours/top-5-cheap")
  .get(tour.topfivecheapesttour, tour.GetAllTour);

//Aggregration
app.route("/api/v1/tours/tours-stats").get(tour.getTourStats);

app.route("/api/v1/tours/tours-yearly/:year").get(tour.getMonthlyPlan);

app.route("/api/v1/tours").get(tour.GetAllTour).post(tour.CreateNewTour);

app
  .route("/api/v1/tours/:id")
  .get(tour.GetOneTour)
  .patch(tour.UpdateOneTour)
  .delete(tour.DeleteOneTour);

app.all("*", (req, res,next) => {
  // res.status(404).json({
  //     status:"Failed!",
  //     message:"Cannot get the Request route"
  // })  
  next(new AppError('Cannot Find The Route',400));
//   const err = new Error('Cannot get the Request route');
//   err.statusCode = 404;
//   err.status = 'fail';
//   next(err);
});

//GLOBAL Middle ware habdler
app.use((err, req, res, next) => {
   
    // console.log("hello3");
    // console.log(err.status,err.message);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
//   console.log(err.status,err.message);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
// // app.route("/api/v1/tours/:id").get(tour.GetOneTour).patch(tour.UpdateOneTour);
// app
//   .route("/api/v1/tours/:id")
//   .get(tour.GetOneTour)
//   .patch(tour.UpdateOneTour)
//   .delete(tour.DeleteOneTour);

// app.route("/api/v1/users").get((req, res) => {});

// app.route("/api/v1/tours").get(tour.GetAllTour).post(tour.CreateNewUser);
// app
//   .route("/api/v1/tours/:id")
//   .get(tour.GetOneTour)
//   .patch(tour.UpdateOneTour)
//   .delete(tour.DeleteOneTour);

module.exports = app;

///creating own middle ware

// app.use((req,res,next)=>{
// console.log("hello form the  iddle ware");
// next();
// })

//creating the middle ware with the help of Morgan
// app.use(morgan("dev"));

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
// console.log(tours[5]);
// for (let i of tours) console.log(i.id);

// const GetAllTour = (req, res) => {
//   console.log(tours);
//   res.status(200).json({
//     status: "success",
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// };

// const CreateNewTour = (req, res) => {
//   console.log(req.body);
//   const newid = tours[tours.length - 1].id + 1;
//   // console.log(newid);
//   const newTour = Object.assign(
//     {
//       id: newid,
//     },
//     req.body
//   );
//   console.log(newTour);
//   tours.push(newTour);
//   fs.writeFile(
//     "./starter/dev-data/data/tours-simple.json",
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: "success",
//         bode: "added",
//       });
//     }
//   );
//   //   res.send("DONE");

//   // res.status(200).send("Posted the data")
// };

// const GetOneTour = (req, res) => {
//   console.log(req.params);
//   res.status(200).json({
//     status: "success",
//     body: tours[req.params.id],
//   });
// };

// const UpdateOneTour = (req, res) => {
//   console.log(req.params);
//   res.status(200).json({
//     status: "success",
//     body: tours[req.params.id],
//   });
// };

// const DeleteOneTour = (req, res) => {
//   console.log(req.params);
//   res.status(200).json({
//     status: "success",
//     body: tours[req.params.id],
//   });
// };
