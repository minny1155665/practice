const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../joiSchema');

// validate with JOI
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// post
router.post('/', validateReview, catchAsync(async (req, res) => {
    const { campId } = req.params;
    const camp = await Campground.findById(campId);
    const review = new Review(req.body);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${ camp._id }`);
}))

// delete
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { campId, reviewId } = req.params;
    await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId } });
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${ campId }`);
}))

module.exports = router;