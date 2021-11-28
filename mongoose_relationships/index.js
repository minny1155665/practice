// 為甚麼又可以 require 了喇
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Product = require('./models/product');
const Farm = require('./models/farm');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.listen('8000', () => {
    console.log("Listening on port 8000");
})

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Connection open!");
})
.catch(() => {
    console.log("Error:(((");
})

const categories = ['fruit', 'vegetable', 'dairy'];

// PRODUCT ROUTE
// index
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({category});
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'all' });
    }
})

// new
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect('/products');
})

// update
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, {runValidators: true});
    res.redirect(`/products/${updated._id}`);
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

// show
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('farm');
    res.render('products/show', { product });
})



// FARM ROUTE
// index
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });
})

// new
app.get('/farms/new', (req, res) => {
    res.render('farms/new');
})

app.post('/farms', async (req, res) => {
    const newFarm = new Farm(req.body);
    await newFarm.save();
    res.redirect('/farms')
})

// new a product
app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', { farm, categories });
})

app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const product = new Product(req.body);
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${ id }`);
})

// delete 
app.delete('/farms/:id', async (req, res) => {
    const { id } = req.params;
    await Farm.findByIdAndDelete(id);
    res.redirect('/farms');
})

// show
app.get('/farms/:id', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id).populate('products');
    res.render('farms/show', { farm });
})
