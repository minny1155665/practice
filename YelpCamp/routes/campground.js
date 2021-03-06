const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../joiSchema');
const { isLoggedIn } = require('../middleware');

// validate with JOI
const validateCampground = (req, res, next) => {
    // if (!req.body) throw new ExpressError("Invalid campground data", 400);
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// index
router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({}); 
    res.render('campgrounds/index', { camps });
}))

// new
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampground, isLoggedIn, catchAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body);
    await newCamp.save();
    req.flash('success', 'Succesfully made a campground');
    res.redirect('/campgrounds');
}))

// update
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
}))

router.put('/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updated = await Campground.findByIdAndUpdate(id, req.body, {runValidators: true});
    req.flash('success', 'Succesfully updated a campground');
    res.redirect(`/campgrounds/${ updated._id }`);
}))

// delete
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted a campground');
    res.redirect('/campgrounds');
}))

// show
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    if (!camp) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/details', { camp });
}))

module.exports = router;