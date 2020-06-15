const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  console.log('We have a new connection.');

  socket.on('join', ({ name, room }, callback) => {
    //do some things when a join happens
    const { error, user } = addUser({
      id: socket.id,
      name,
      room,
    });

    // // TESTING
    // // ON JOIN, ADD USER
    // console.log('added user with id of');
    // console.log(socket.id);

    if (error) return callback(error);

    // join room with user
    socket.join(user.room);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to the room ${user.room}`, // template literal string
    });

    // send message to everyone besides that one specific user
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name}, has joined!` });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    // send a callback without any error
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    console.log('socket.on sendMessage, getUser()');
    console.log(user);

    io.to(user.room).emit('message', { user: user.name, text: message });
    console.log(`socket.io to room of ${user.room}`);
    console.log(`saying a message of ${message}`);

    // test 3
    // the user object from adduser during ajoin should be the same as a send message user obj

    // test addUser and getUser to be the same return

    //temp test
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'Admin',
        text: `${user.name} has left the room.`,
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
    console.log('User Left.');
  });
});

server.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`));
