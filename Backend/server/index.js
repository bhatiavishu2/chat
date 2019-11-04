const path = require('path');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
// const Chat = require("../models/Chat");
const moment = require("moment")
// const ChatDetail = require("../models/chatDetail");

const { generateMessage, generateLocationMessage } = require('./utils/message.js');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
// chats api routes
const chats = require('./routes/api/chats');
const chatModel = require('./routes/api/chatDatabase');
const PORT = process.env.PORT || 4300;


const app = express();
app.use(cors());
app.options('*', cors());
// Body Parser Middleware
app.use(bodyParser.json());
app.use('/chats', chats);
const server = http.createServer(app);
app.use(express.static(publicPath));
const connect = require("./dbconnect");

var io = socketIO(server);
// const redisAdapter = require('socket.io-redis');
// io.adapter(redisAdapter({ host: 'localhost', port: 63 }));
var users = new Users();

io.on('connection', (socket) => {

    socket.on('leave', (params) => {
        socket.leave(params.room);
    });

    socket.on('join', (params, callback) => {

        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Bad request');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        chatModel.getRoomMessages(params.room).then((result)=>{
            socket.emit('oldMessages', result);
            socket.emit('newMessage', generateMessage('Admin', params.room, 'Welcome to the chat app.'));
            socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', params.room, `${params.name} has joined.`));
            callback();
        })
    });

    socket.on('createMessage', async (message, callback) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            chatModel.createRoomMessage({roomTitle:user.room, chatMsg: message.text, msgBy:user.name, createdDate: moment().valueOf()}).then((err, result) => {
                console.log(err, result);
            });
            let tempObj = generateMessage(user.name, user.room, message.text);
            io.to(user.room).emit('newMessage', tempObj);
            callback({
                data: tempObj
            });
        }
        callback();
    });

    socket.on('createLocationMsg', (coords) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('createLocationMsg', generateLocationMessage(user.name, user.room, coords.lat, coords.lon));
        }
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', user.room, `${user.name} has left.`));
        }
    });

});

server.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

connect.then(db => {
    console.log("connected correctly to the server");
  });

