const { urlencoded } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));

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
    res.redirect('/home');
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
        res.send("WELCOME!!");
    } else {
        res.send("PUI PUI");
    }
})

// secret
app.get('/secret', (req, res) => {
    res.send("secret!!!");
})