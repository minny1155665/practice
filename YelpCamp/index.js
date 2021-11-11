const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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

app.get('/', (req, res) => {

})

// index
app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find({}); 
    res.render('campgrounds/index', { camps });
})

// new
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const newCamp = new Campground(req.body);
    await newCamp.save();
    res.redirect('/campgrounds');
})

// update
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const updated = await Campground.findByIdAndUpdate(id, req.body, {runValidators: true});
    res.redirect(`/campgrounds/${ updated._id }`);
})

// delete
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

// show
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/details', { camp });
})