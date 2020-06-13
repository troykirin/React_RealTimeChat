const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./Users/Users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('We have a new connection.');

  socket.on('join', ({ name, room }, callback) => {
    //do some things when a join happens
    const { error, user } = addUser({
      id: socket.id,
      name: name,
      room: room,
    });

    if (error) return callback(error);

    socket.emit('message', {
      user: 'admin',
      //  // template literal string
      text: `${user.name}, welcome to the room ${user.room}`,
    });

    // send message to everyone besides that one specific user
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name}, has joined!` });

    // join room with user
    socket.join(user.room);

    // send a callback without any error
    callback();
  });

  socket.on('disconnect', () => {
    console.log('User Left.');
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`));
