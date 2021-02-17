//this is the script file which we use to immport the data json file directly into mongoose
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../../models/tourmodel');
//environment variable
// console.log(app.get("env"));
//nodejs environment variable
// console.log(process.env);

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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data loaded Successfully');
  } catch (err) {
    console.log(err);
  }
};

const DeleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted Successfully');
  } catch (err) {
    console.log(err);
  }
};

// DeleteData();
importData();
