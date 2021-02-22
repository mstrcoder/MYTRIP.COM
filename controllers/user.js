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
const users = JSON.parse(
  fs.readFileSync("./starter/dev-data/data/users.json", "utf-8")
);



const GetAllUser = (req, res) => {
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
};

const CreateNewUser = (req, res) => {
  // console.log(req.body);
  const newid = users[users.length - 1].id + 1;
  // console.log(newid);
  const newUser = Object.assign(
    {
      id: newid,
    },
    req.body
  );
  // console.log(newUser);
  users.push(newUser);
  fs.writeFile(
    "./starter/dev-data/data/users.json",
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: "success",
        body: "added",
      });
    }
  );
  //   res.send("DONE");

  // res.status(200).send("Posted the data")
};

const GetOneUser = (req, res) => {
  console.log(req.params);
  const val = users.find((ele) => {
      if(ele.id === req.params.id)return ele;
  });
//   console.log(val);
  if (!val) {
    res.status(400).json({
      status: "failed",
      body: "Could not Locate the ID!",
    });
  }
  res.status(200).json({
    status: "success",
    body: val,
  });
};

const UpdateOneUser = (req, res) => {
  // console.log(req.params);
  res.status(200).json({
    status: "success",
    body: users[req.params.id],
  });
};

const DeleteOneUser = (req, res) => {
  // console.log(req.params);
  res.status(200).json({
    status: "success",
    body: users[req.params.id],
  });
};

exports.GetAllUser = GetAllUser;

exports.CreateNewUser = CreateNewUser;

exports.GetOneUser = GetOneUser;

exports.UpdateOneUser = UpdateOneUser;

exports.DeleteOneUser = DeleteOneUser;
