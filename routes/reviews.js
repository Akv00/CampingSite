const express = require("express");
const router = express.Router({mergeParams: true});
const { campgroundSchema, reviewSchema } = require("../schemas.js");
const Review = require("../models/review");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const {validateReview,isLoggedIn} = require("../middleware.js")

router.post(
  "/",isLoggedIn,validateReview,
  catchAsync(async (req, res) => {
    console.log("wer");
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    console.log("we");
    await review.save();
    await campground.save();
    req.flash("success","Created New Review!!!")
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","successfully deleted the review")
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;