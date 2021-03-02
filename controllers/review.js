const Review= require("./../models/reviewmodel");
const catchAsync=require('./../utilities/asyncerror');
const AppError=require('./../utilities/apperror');
const express = require("express");
const handler=require('./handler')
const Tour=require("./../models/tourmodel");
exports.createReview=catchAsync(async (req, res, next) => {

    // alolow nested routes
    // console.log('we get into thih route!');
    // console.log(req.originalUrl);
    // console.log(req.params.TourId);
    let  name=req.params.TourId.split('%20').join(' ');
    // console.log(name);
    const tour=await Tour.findOne({ slug: req.params.TourId })
    // console.log(tour);
    if(!req.body.tour)req.body.tour=tour._id;  
    if(!req.body.user)req.body.user=req.user.id;
    // console.log(req.body);
    const review=await Review.create(req.body)
    // console.log(review);
    res.status(201).json({
        status: "success",
        body: "added",
      });
})

exports.getAllReview=catchAsync(async (req, res, next) => {
    const review=await Review.find();
    res.status(201).json({
        status: "success",
        body: review,
      });
})

exports.getReview=handler.getOne(Review);

exports.deleteReview=handler.deleteOneTour(Review)