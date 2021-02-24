const Review= require("./../models/reviewmodel");
const catchAsync=require('./../utilities/asyncerror');
const AppError=require('./../utilities/apperror');
const express = require("express");

exports.createReview=catchAsync(async (req, res, next) => {
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