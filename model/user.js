const mongoose  = require('mongoose')

const userScheme = new mongoose.Schema({
    userName: {
        type: String,
        minlength: 3,
        maxlength: 12,
        unique: true
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String, 
    },
    token: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('User', userScheme);