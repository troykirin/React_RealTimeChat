import React, { Fragment, useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";

const ENDPOINT = "localhost:5000";

//outside of component create socket var
let socket;

// location passed from react router
const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    // const data = queryString.parse(location.search);
    // a better way with destructuring
    const { name, room } = queryString.parse(location.search);

    // after first connection
    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    console.log(socket);
    // console.log(location.search);
    // console.log(name);
    // console.log(room);
  }, [ENDPOINT, location.search]);
  // use array above to indicate when useEffect should render. Which is when ENDPOINT || location.search changes.

  return <h1>Chat</h1>;
};

export default Chat;
