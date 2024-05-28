const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
  
    point: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Card', cardSchema);





