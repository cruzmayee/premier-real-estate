const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true}, 
    price: {type: Number, required: true},
    productImage: {type: String, required: true},
    address: {type: String, required: true},
    status: {type: String, required: true},
    property: {type: String, required: true}
});

module.exports = mongoose.model('Product', productSchema);