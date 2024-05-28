const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true, // L'e-mail de l'utilisateur est requis
    },
    password: {
        type: String,
        required: true, // L'e-mail de l'utilisateur est requis
    },
    company: {
        type: String,

    },
    avatar: {
        type: String,
    },
    status: {
        type: String,// Le statut de l'utilisateur doit être l'un des trois valeurs : active, inactive, ou pending
    },
    role: {
        type: String,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
