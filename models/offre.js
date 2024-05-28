const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  }
});

const Item = mongoose.model('Item', ItemSchema);


module.exports = Item;