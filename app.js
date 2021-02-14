const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
const tours = JSON.parse(
  fs.readFileSync("./starter/dev-data/data/tours-simple.json", "utf-8")
);
console.log(tours[5]);
for (let i of tours) console.log(i.id);

app.get("/api/v1/tours", (req, res) => {
  console.log(tours);
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  console.log(req.body);
  const newid = tours[tours.length - 1].id + 1;
  // console.log(newid);
  const newTour = Object.assign({ id: newid }, req.body);
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
});

app.get("/api/v1/tours/:id", (req, res) => {
  console.log(req.params);
  res.status(200).json({
    status: "success",
    body: tours[req.params.id],
  });
});

app.patch("/api/v1/tours/:id", (req, res) => {
  console.log(req.params);
  res.status(200).json({
    status: "success",
    body: tours[req.params.id],
  });
});

app.delete("/api/v1/tours/:id", (req, res) => {
  console.log(req.params);
  res.status(200).json({
    status: "success",
    body: tours[req.params.id],
  });
});

app.listen(8000, () => {
  console.log("server listening on Port 8000");
});
