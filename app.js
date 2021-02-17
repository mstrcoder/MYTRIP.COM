const express = require("express");
const fs = require("fs");
const app = express();
const morgan = require("morgan");
const tour = require("./controllers/tour");
const user = require("./controllers/user");
// const {GetAllTour,CreateNewTour,GetOneTour,UpdateOneTour,DeleteOneTour} = require('./tour');
//used to add iddleware
app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`));

app.route("/api/v1/tours").get(tour.GetAllTour).post(tour.CreateNewTour);
app.route("/api/v1/tours/:id").get(tour.GetOneTour).patch(tour.UpdateOneTour).delete(tour.DeleteOneTour);
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
