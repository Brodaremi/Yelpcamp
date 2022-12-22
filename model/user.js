const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { string } = require('joi');
const { mongo } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
