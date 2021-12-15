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

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const registered = await User.register(user, password);
        req.login(registered, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelpcamp!');
            res.redirect('/campgrounds');
        })
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
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

// logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Good Bye!');
    res.redirect('/campgrounds');
})



module.exports = router;