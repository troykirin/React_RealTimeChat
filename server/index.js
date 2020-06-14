const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

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
      text: `${user.name}, welcome to the room ${user.room}`, // template literal string
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

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left the room.`,
      });
    }
    console.log('User Left.');
  });
});

app.use(cors());
app.use(router);

server.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`));
