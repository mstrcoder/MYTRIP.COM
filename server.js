const app = require("./app");

//environment variable
console.log(app.get("env"));
//nodejs environment variable
console.log(process.env);

app.listen(8000, () => {
  console.log("server listening on Port 8000");
});

