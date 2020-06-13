import React, { useState, useEffect, Fragment } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';

const ENDPOINT = 'localhost:5000';

//outside of component create socket var
let socket;

// location passed from react router
const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  useEffect(() => {
    // const data = queryString.parse(location.search);
    // a better way with destructuring
    const { name, room } = queryString.parse(location.search);

    // after first connection
    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, () => {});

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [location.search]);
  // use array above to indicate when useEffect should render. Which is when ENDPOINT || location.search changes.

  return (
    <Fragment>
      <h1>Chat Room</h1>
      <h2>Welcome, {name}</h2>
      <h2>Room name: {room}</h2>
    </Fragment>
  );
};

export default Chat;
