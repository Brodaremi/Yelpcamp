const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require("../model/review");
const Campground = require("../model/campground");
const catchAsync = require("../utilis/catchASync");
const ExpressError = require("../utilis/ExpressError");
const {reviewSchema} = require("../schemas.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;