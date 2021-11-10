const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        reuired: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['vegetable', 'fruit', 'dairy']
    }
})
const Product = mongoose.model('Product', productSchema);

module.exports = Product;