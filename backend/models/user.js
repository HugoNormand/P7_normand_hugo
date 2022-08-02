const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true } ,
    isAdmin: { type: Boolean, default: false},
    username: { type: String, required: true, unique: true } ,
    password: { type: String, required: true } ,
    profilImage: { type: String, default: '' }, 
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserTable', userSchema)