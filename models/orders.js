const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Autres champs de commande
  pointsEarned: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Order', orderSchema);
