import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

import './Chat.css';

//outside of component create socket var
let socket;

// location passed from react router
const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:5000';

  const sendMessage = (event) => {
    event.preventDefault(); // prevent default of keypress or button press to refresh the entire page

    // if a message came in, emit the message to socket, then setMessage back to empty.
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  // React Hooks Effects for Rendering
  // Effects, InfoBar, Messages, Input
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    // after first connection
    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      socket.emit('disconnect');
    };
  }, [ENDPOINT, location.search]);
  // use array above to indicate when useEffect should render. Which is when ENDPOINT || location.search changes.

  // Effects Messages
  // Render when 'message' is emitted on socket.
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]); // set messages state with a anonymous function to take messages array and return another array by spreading messages while appending message onto the end of list
      console.log('settingMessages');
      console.log(message);
    });

    socket.on('roomData', ({ users }) => {
      console.log('Hit roomData Socket.on');
      console.log(users);
      setUsers(users);
    });
  }, []);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
