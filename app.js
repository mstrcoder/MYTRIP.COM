const express = require("express");
const fs = require("fs");
const app = express();
const morgan = require("morgan");
const path = require('path');
const tour = require("./controllers/tour");
const user = require("./controllers/user");
const review = require("./controllers/review");
const querystring = require("querystring");
const AppError = require("./utilities/apperror");
const catchAsync = require("./utilities/asyncerror");
const dotenv = require("dotenv");
const Auth = require("./controllers/auth");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const views = require('./views');
const Parser=require('cookie-parser')
const multer = require('multer');




app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))
// const {GetAllTour,CreateNewTour,GetOneTour,UpdateOneTour,DeleteOneTour} = require('./tour');
//used to add iddleware 
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too MAny Request from This IP",
});
app.use("/api", limiter);
//secure the HTTP resquest Header
app.use(helmet());

app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({extended:true}))
app.use(Parser())
//DATA Sanitisation Againstb NoSQL query injections
app.use(mongoSanitize());

//DATA sanitization against xss
app.use(xss());

//hppapp.use(express.)
app.use(
  hpp({
    whitelist: ["duration", "ratingQuantity", "ratingDifficulty"],
  })
);
//Data Sanitisation
app.use(express.static(`${__dirname}/public`));

const upload=multer({dest:'public/img/users'})
// app.use((req, res, next) => {
//   // console.log(req.headers);
//   next(); 
// });
// console.log("hello form mod1");
app
  .route("/api/v1/tours/top-5-cheap")
  .get(tour.topfivecheapesttour, tour.GetAllTour);

//Aggregration

app.route("/api/v1/tours/tours-stats").get(tour.getTourStats);

app.route("/api/v1/tours/tours-yearly/:year").get(tour.getMonthlyPlan);

app
  .route("/api/v1/tours")
  .get(tour.GetAllTour)
  .post(
    Auth.protect,
    Auth.restrictTo("admin", "lead-guide"),
    tour.CreateNewTour
  );

app
  .route("/api/v1/tours/:id")
  .get(tour.GetOneTour)
  .patch(
    Auth.protect,
    Auth.restrictTo("admin", "lead-guide"),
    tour.UpdateOneTour
  )
  .delete(
    Auth.protect,
    Auth.restrictTo("admin", "lead-guide"),
    tour.DeleteOneTour
  );

app.route("/users/signup").post(Auth.signup);
app.route("/users/login").post(Auth.login);
app.route("/users/logout").get(Auth.logout);
app.route("/users/forgotPassword").post(Auth.forgotPassword);
app.route("/users/resetPassword/:token").patch(Auth.resetPassword);
app.route("/users/updateMyPassword").patch(Auth.protect, Auth.updatePassword);
app.route("/users/updateMe").patch(Auth.protect,user.uploadPhotos, user.updateMe);
app.route("/users/deleteMe").patch(Auth.protect, user.deleteMe);
app.route("/users/me").get(Auth.protect, user.getMe, user.GetOneUser);

//now for review
app
  .route("/review")
  .get(review.getAllReview)
  .post(Auth.protect, Auth.restrictTo("user"), review.createReview);
app.route("/review/:TourId").get(review.getReview);

// .get(review.getAllreview)

//LETS TALK ABOUT NESTED ROUTES
app
  .route("/api/v1/tours/:tourId/reviews")
  .post(Auth.protect, Auth.restrictTo("user"), review.createReview)
  .delete(review.deleteReview);


//GEOLOCATION
app.route('/tours/tours-within/:distance/centre/:latlng/unit/:unit').get(tour.getTourWithin)


//PUGHapp.get('/')
 app.use('/',views);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //     status:"Failed!",
  //     message:"Cannot get the Request route"
  // })
  next(new AppError("Cannot Find The Route", 400));
  // const err = new Error('Cannot get the Request route');
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);
});

//GLOBAL Middle ware habdler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: err.message
  // });
  // console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    if(req.originalUrl.startsWith("/api"))
    {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      });
    }
    else
    {
      res.status(err.statusCode).render('error',{
        title:'Something Went Wrong', 
        msg:err.message
      });
    }
  
  } else if (process.env.NODE_ENV === "production") {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // console.error('Error!',err);
      // console.log("ERROR!!!!");
      res.send(500).json({
        status: "error",
        message: "Something Went Wrong",
      });
    }
  }
  // console.log("hello3");
  // console.log(err);
  // console.log(err.status,err.message);

  // console.log(err.status,err.message);
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
