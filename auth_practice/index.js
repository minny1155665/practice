const { urlencoded } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));
app.use(session({ secret: 'secret' , resave: false, saveUninitialized: true}));

mongoose.connect('mongodb://localhost:27017/authDemo')
    .then(() => console.log("mongo connection open!"))
    .catch(() => console.log("MONGO CONNECTION ERROR!"));

app.listen(8000, () => {
    console.log("Listening on port 8000...");
})

// home page
app.get('/home', (req, res) => {
    res.send("home page!");
})

// register
app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    });
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/secret');
})

// log in
app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        req.session.user_id = user._id;
        res.redirect('/secret');
    } else {
        res.redirect('/login');
    }
})

// log out
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login')
})

// secret
app.get('/secret', (req, res) => {
    if (!req.session.user_id){
        res.redirect('/login');
    } else {
        res.render('secret');
    }
})