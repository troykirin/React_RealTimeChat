// manage users sign in, out, leaving, what room xyz.

// declare array of users
const users = [];

//
const addUser = ({ id, name, room }) => {
  // if user enters x, change to y
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // user to enter same room with existing username
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  // throw error if username already exists
  if (existingUser) {
    return { error: 'Username is taken.' };
  }

  // otherwise, create user
  const user = { id, name, room };

  users.push(user);
  // TESTING
  // // push new user onto array of users
  // console.log('Users array was pushed on, new users arrray is now.');
  // console.log(users);

  return { user };
};

const removeUser = (id) => {
  //find the user, set to index
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0]; // 1 splice and return just one user "[0]"
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => {
  // TESTING
  // console.log('running getUsersInRoom().');
  // console.log(users);
  // const usersList = users.filter((user) => user.room === room);
  // console.log('after filter');
  // console.log(usersList);
  // return { usersList };

  // return the object itself, not packaged as an object that has to be destructured.
  return users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
