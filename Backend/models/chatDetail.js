const mongoose = require('mongoose');
const config = require('../config/database');

// Chat Detail Schema
const ChatDetailSchema = mongoose.Schema({
    chatMsg: {
        type: String,
        required: true
    },
    msgBy: {
        type: String,
        required: true
    }
    ,
    roomTitle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    createdDate: {
        type: Number,
        required: true
    }
});

const ChatDetail =  module.exports = mongoose.model('ChatDetail', ChatDetailSchema);

module.exports.addChatMsg = function (newMsg, callback) {
    newMsg.save(callback);
};