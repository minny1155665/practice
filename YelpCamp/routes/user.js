const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');

const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// register
router.get('/register', (req, res) => {
    res.render('auths/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const registered = await User.register(user, password);
        req.flash('success', 'Welcome to Yelpcamp!');
        res.redirect('/campgrounds');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
    
}))

// login
router.get('/login', (req, res) => {
    res.render('auths/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome to Yelpcamp!');
    res.redirect('/campgrounds');
})

// logout


module.exports = router;