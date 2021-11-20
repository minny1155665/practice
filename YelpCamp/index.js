const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./joiSchema');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

app.listen('3000', () => {
    console.log("Listening on port 3000...");
})

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("Database connected!");
});

const validateCampground = (req, res, next) => {
    // if (!req.body) throw new ExpressError("Invalid campground data", 400);
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// index
app.get('/campgrounds', catchAsync(async (req, res) => {
    const camps = await Campground.find({}); 
    res.render('campgrounds/index', { camps });
}))

// new
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body);
    await newCamp.save();
    res.redirect('/campgrounds');
}))

// update
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updated = await Campground.findByIdAndUpdate(id, req.body, {runValidators: true});
    res.redirect(`/campgrounds/${ updated._id }`);
}))

// delete
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

// show
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/details', { camp });
}))

// error handler
app.all('*', (req, res, next) => {
    next(new ExpressError('NO PAGE FOUND!', 404));
})

app.use((err, req, res, next) => {
    const {status = 500} = err;
    if (!err.message) err.message = "SOMETHING WENT WRONG!";
    res.status(status).render('error', { err });
})