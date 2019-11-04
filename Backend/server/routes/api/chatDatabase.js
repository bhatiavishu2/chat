const Chat = require('../../../models/Chat');
const ChatDetail = require('../../../models/chatDetail');
const User = require('../../../models/User');
const config = require('../../../config/database');
const express = require('express');
const http = require('http').Server(express);
const io = require('socket.io')(http);

module.exports = { getRooms : async ()=> {
    return await Chat.find()
    .sort({ date: -1 });
},

createRoom : async (data)=> {
    const {roomTitle, createdBy} = data;
    let newChat = new Chat({
        roomTitle,
        createdBy
    });

    Chat.addChatRoom(newChat, (err, chat) => {
        if (err) {
            return {
                success: false,
                msg: 'Can not create Chat room'
            }

        }
        else {
            return{
                success: true,
                msg: 'Successfully created a chat room'
            };
        }
    });
},

getRoomMessages : async (chatId) => {
    const room = await Chat.findOne({roomTitle: chatId});
    if(!room){
        return 'invalid room id';
    }
    return await ChatDetail.find({roomTitle: room.id}).populate('roomTitle');
},

createRoomMessage : async ({roomTitle,chatMsg,msgBy, createdDate})=> {
    const roomData = await Chat.findOne({roomTitle: roomTitle});
    let newMsg = new ChatDetail({roomTitle: roomData.id, chatMsg, msgBy, createdDate});

    return await ChatDetail.addChatMsg(newMsg);
},

createUser : async ({room, userName})=> {
    const roomData = await Chat.findOne({roomTitle: room});
    let newMsg = new User({room: roomData.id, userName});

    return await ChatDetail.addChatMsg(newMsg);
},

deleteRoom : async ()=> {
    const chatMsgId = req.params.id;
    ChatDetail.findById(chatMsgId)
        .then(chat => chat.remove().then(async ()=> res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
},


updateRoom : async ()=> {
    const chatMsgId = req.params.id;
    ChatDetail.findById(chatMsgId).exec(function (err, result) {
        result.set({
            chatMsg: req.body.chatMsg,
            msgBy: req.body.msgBy
        });
        result.save(function (err, newResult) {
            if (err) {
                console.log(err);
            } else {
                io.on('connection', function (socket) {
                    console.log('Msg updates....');
                    socket.on('getMsgBy', function(data) {
                        console.log(data);
                        socket.emit('msgData', {msgBy: data});
                    });

                    socket.on('msgToAll', function(data) {
                        //Send message to everyone
                        io.sockets.emit('newmsg', data);
                    });
                });
            }
        });
    });
}
}