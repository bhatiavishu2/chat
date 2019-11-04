const mongoose = require('mongoose');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
});

const User =  module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = function (newUser, callback) {
    newUser.save(callback);
};