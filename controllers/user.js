const express = require("express");
const fs = require("fs");
const app = express();
const morgan = require("morgan");
const AppError = require("./../utilities/apperror");
const catchAsync = require("./../utilities/asyncerror");
const User = require("./../models/usermodel");
const handler = require("./handler");
const multer = require("multer");
const sharp = require("sharp");
// const multerStorage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,'public/img/users')
//   },
//   filename:(req,file,cb)=>{
//     const ext=file.mimetype.split('/')[1];
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// })
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  //upload file are image or not
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not An Image ! Please Upload only Images", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadPhotos = upload.single("photo");

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};
//used to add iddleware
app.use(express.json());
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
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

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file, req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is for not for password Update", 400));
  }
  // const user=User.
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  // console.log('we got the bhayya',filteredBody);
  // // console.log(req.user.id);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // console.log(updatedUser);
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // if (req.body.password || req.body.passwordConfirm) {
  //   return next(new AppError("This route is for not for password Update", 400));
  // }
  // // const user=User.
  // const filteredBody=filterObj(req.body,'name','email')
  await User.findByIdAndUpdate(req.body.id, { active: true });
  res.status(204).json({
    status: "success",
  });
});

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

const GetOneUser = handler.getOne(User);
// const GetOneUser = (req, res) => {
//   console.log(req.params);
//   const val = users.find((ele) => {
//     if (ele.id === req.params.id) return ele;
//   });
//   //   console.log(val);
//   if (!val) {
//     res.status(400).json({
//       status: "failed",
//       body: "Could not Locate the ID!",
//     });
//   }
//   res.status(200).json({
//     status: "success",
//     body: val,
//   });
// };

const UpdateOneUser = (req, res) => {
  // console.log(req.params);
  res.status(200).json({
    status: "success",
    body: users[req.params.id],
  });
};

const DeleteOneUser = handler.deleteOneTour(User);
// const DeleteOneUser = (req, res) => {
//   // console.log(req.params);
//   res.status(200).json({
//     status: "success",
//     body: users[req.params.id],
//   });
// };

exports.GetAllUser = GetAllUser;

exports.CreateNewUser = CreateNewUser;

exports.GetOneUser = GetOneUser;

exports.UpdateOneUser = UpdateOneUser;

exports.DeleteOneUser = DeleteOneUser;
