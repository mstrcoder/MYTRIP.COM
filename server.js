const app = require("./app");
const mongoose = require("mongoose");
const tour = require('./models/tourmodel');
//environment variable
// console.log(app.get("env"));
//nodejs environment variable
// console.log(process.env);

mongoose
  .connect(
    "mongodb+srv://ifham:1234@cluster0.d8o0d.mongodb.net/MYTRIP?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((con) => {
    // console.log(con.connection);
    console.log("We are Connected to the Database");
    
  });





// const MyfirstTour = new Tour({
//   price: 100000,
// });
//its also give the log of data
// MyfirstTour.save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log("error aagya!  ", err);
//   });

app.listen(5000, () => {
  console.log("server listening on Port 5000");
});
