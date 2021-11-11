const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("Database connected!");
});

const random = (arr) => arr[Math.floor(Math.random()*arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomCity = Math.floor(Math.random()*1000);
        const camp = new Campground({
            title: `${ random(descriptors) } ${ random(places) }`,
            location: `${ cities[randomCity].city }, ${ cities[randomCity].state }`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    db.close();
});