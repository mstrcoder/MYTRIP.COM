//this is the script file which we use to immport the data json file directly into mongoose
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../../models/tourmodel');
const User = require('./../../../models/usermodel');
const Review = require('./../../../models/reviewmodel');
//environment variable
// console.log(app.get("env"));
//nodejs environment variable
// console.log(process.env);

// mongoose
//   .connect(
//     'mongodb+srv://ifham:1234@cluster0.d8o0d.mongodb.net/MYTRIP?retryWrites=true&w=majority',
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     // console.log(con.connection);
//     console.log('We are Connected to the Database');
//   });
mongoose
  .connect(
    'mongodb+srv://ifham:1234@cluster0.d8o0d.mongodb.net/MYTRIP?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((con) => {
    // console.log(con.connection);
    console.log('We are Connected to the Database');
  });

//Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
console.log(tours);

// const importData = async () => {
//   try {
//     await Tour.create(tours);
//     console.log('Data loaded Successfully');
//   } catch (err) {
//     console.log(err);
//   }
// };

// const DeleteData = async () => {
//   try {
//     await Tour.deleteMany();
//     console.log('Data Deleted Successfully');
//   } catch (err) {
//     console.log(err);
//   }
// };

const importData = async () => {
  try {
    await Tour.create(tours);
    // await User.create(users,{validateBeforeSave:false});
    // await Review.create(reviews,{validateBeforeSave:false});
    console.log('Data loaded Successfully');
  } catch (err) {
    console.log(err);
  }
};

const DeleteData = async () => {
  try {
    await Tour.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log('Data Deleted Successfully');
  } catch (err) {
    console.log(err);
  }
};

// DeleteData();
importData();
