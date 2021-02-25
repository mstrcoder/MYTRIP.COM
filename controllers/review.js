const Review= require("./../models/reviewmodel");
const catchAsync=require('./../utilities/asyncerror');
const AppError=require('./../utilities/apperror');
const express = require("express");
const handler=require('./handler')
exports.createReview=catchAsync(async (req, res, next) => {

    // alolow nested routes
    if(!req.body.tour)req.body.tour=req.params.tourId;
    if(!req.body.user)req.body.user=req.user.id;
    const review=await Review.create(req.body)
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