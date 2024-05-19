const mongoose = require('mongoose');
const Schema = mongoose.Schema;     //just to save time instead of typing mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
UserSchema.plugin(passportLocalMongoose);   //Add-on Passport package to UserSchema that have fields for username, passport, provides validation, and additional methods.

module.exports = mongoose.model('User', UserSchema);