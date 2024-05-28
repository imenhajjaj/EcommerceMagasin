const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    phone: {
        type: String,
        required: true
    },
  
    address: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    price:{
        type: String,

    },
    magasin: {
        type: String,
        required: true
    }, 
    point:{
        type: String,

    }
});
module.exports = mongoose.model('Commande', commandeSchema);





