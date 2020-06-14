import React from 'react';

import './Message.css';

const Messages = ({ message: { user, text }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer">
      <p className="sentText">{trimmedName}</p>
      <div className="messageBox">
        <p className="messageText">{text}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <p className="sentText">{trimmedName}</p>
      <div className="messageBox">
        <p className="messageText">{text}</p>
      </div>
    </div>
  );
};

export default Messages;
