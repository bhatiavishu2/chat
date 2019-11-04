/**
 * @file   chats.js
 * @path /routes/api/chats.js
 * @author: Md Ariful Islam
 */
const express = require('express');
const router = express.Router();
const chatModal = require('./chatDatabase');




// get list of all chat room list
/**
 * @route   GET api/chats/list
 * @desc    Get all chatrooms list
 */
router.get('/list', (req, res, next) => {
    chatModal.getRooms().then(chats => res.json(chats));
});

/**
 * @route   POST api/chats/create
 * @desc    Create a new chat room
 * @param   {String} roomTitle
 * @param   {String} createdBy
 */
router.post('/create', (req, res) => {
    chatModal.createRoom(req.body).then(result => {
        res.json(result);
    });
});

/**
 * @route   GET api/chats/detail/:id
 * @desc    Get Chat Details
 * @param   {String} chatId
 */
router.get('/detail/:id', (req, res, next) => {
    chatModal.getRoomMessages(req.params.id).then(result => {
        res.json(result);
    });
});

/**
 * @route   POST api/chats/addMsg/:id
 * @desc    Add new chat msg with chatRoom Id, username, message
 * @param   {String} chatId
 */
router.post('/addMsg/:id', (req, res, next) => {


});

/**
 * Delete chat msg from chat detail
 * @route   DELETE api/chats/delete/:id
 * @desc    Delete A chat message
 * @param   {String} chatMsgId
 * @return  {Boolean}
 */
router.delete('/delete/:id', (req, res) => {

});

/**
 * @route  POST api/chats/update/:id
 * @desc   Update chat Messages
 * @param   {String} chatMsgId
 */
router.post('update/:id', (req, res) => {


});

// test routes
router.get('/test', (req, res, next) => {
    res.send('This route works fine');
});


module.exports = router;


