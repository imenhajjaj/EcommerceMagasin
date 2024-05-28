const mongoose = require('mongoose');
const { Schema } = mongoose;

const clientSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    sizes: [String],
    size: String,
    images: [String],
    stock: { type: String, required: true },
    price: { type: Number, required: true },
    prevprice: { type: Number, required: true },
    qty: Number,
    discount: Number,
    totalprice: Number,
    rating: {
        rate: { type: Number, required: true },
        count: { type: Number, required: true }
    }
});
const ClientProd = mongoose.model('ClientProd', clientSchema);
module.exports = ClientProd;
