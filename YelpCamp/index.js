const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const User = require('./models/user');

//routes
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    // store: none
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen('3000', () => {
    console.log("Listening on port 3000...");
})

// mongo db
mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("Database connected!");
});

// middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// routes
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:campId/reviews', reviewRoutes);
app.use(userRoutes);

// error handler
app.all('*', (req, res, next) => {
    next(new ExpressError('NO PAGE FOUND!', 404));
})

app.use((err, req, res, next) => {
    const {status = 500} = err;
    if (!err.message) err.message = "SOMETHING WENT WRONG!";
    res.status(status).render('error', { err });
})