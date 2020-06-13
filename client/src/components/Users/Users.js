// manage users sign in, out, leaving, what room xyz.

const users = [];

const addUser = ({ id, name, room }) => {
  // if user enters x, change to y
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // user to enter same room with existing username
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: "Username is taken." };
  }

  // otherwise, create user
  const user = { id, name, room };

  // push new user onto array of users
  user.push(user);
};

const removeUser = (id) => {
  //find the user, set to index
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0]; // 1 splice and return just one user "[0]"
  }
};

const getUser = (id) => {
  users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
