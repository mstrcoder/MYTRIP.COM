const app = require("./app");
const mongoose = require('mongoose');
//environment variable
console.log(app.get("env"));
//nodejs environment variable
console.log(process.env);


mongoose.connect('mongodb+srv://ifham:1234@cluster0.d8o0d.mongodb.net/MYTRIP?retryWrites=true&w=majority',{
  useNewUrlParser:true,
  useCreateIndex:true , 
  useFeatureDetection: false
}).then( con =>{
  // console.log(con.connection);
  console.log("We are Connected to the Database");
})
app.listen(8000, () => {
  console.log("server listening on Port 8000");
});
 
