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

// Server has a new connection.
io.on('connect', (socket) => {
  // console.log('We have a new connection.');

  // From login page, a join happens.
  // Take in the name and room from input fields, as well as the callback.
  socket.on('join', ({ name, room }, callback) => {
    // Add a new user with input field as well as the socket id, destructure return obj
    const { error, user } = addUser({
      id: socket.id,
      name,
      room,
    });
    // // TESTING
    // // ON JOIN, ADD USER
    // console.log('added user with id of');
    // console.log(socket.id);

    // If an error returns from addUser, return a callback f. with error
    if (error) return callback(error);
    // console.log(error)

    // Join the socket user created with signin to the requested room
    socket.join(user.room);
    // console.log('User just joined');
    // console.log(user);

    // Emit a welcome message from admin, to the socket who just joined.
    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to the room ${user.room}`, // template literal string
    });

    // Broadcast a message to everyone in the room,that new user just joined. Besides sender.
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'Admin', text: `${user.name}, has joined!` });

    ///

    // io.to(user.room).emit('roomData', {
    //   room: user.room,
    //   users: getUsersInRoom(user.room),
    // });

    // send a callback without any error
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    // console.log('socket.on sendMessage, getUser()');
    // console.log(user);

    io.to(user.room).emit('message', {
      user: user.name,
      text: message,
    });
    // console.log(`socket.io to room of ${user.room}`);
    // console.log(`saying a message of ${message}`);

    // TEST: broadcast list of names to chat of users in the room on every send

    const users = getUsersInRoom(user.room);
    // console.log('Testing users return from getUsersInRoom during sendMessage');
    // console.log(users);

    // Stringify object to simply display to chatbox from admin
    str = JSON.stringify(users);

    socket.broadcast.to(user.room).emit('message', {
      user: 'Admin Troy',
      room: user.room,
      text: `Users Currently Logged In: ${str}`,
    });

    //temp test
    // on a sendMessage, emit roomData to the room's server
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('roomData', () => {
    const user = getUser(socket.id);
    const users = getUsersInRoom(user.room);

    console.log('Testing roomData socket.on');
    console.log(users);
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
    // console.log('User Left.');
  });
});

server.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`));
