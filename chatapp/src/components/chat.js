import React, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";
import JSEncrypt from 'jsencrypt';

const ENDPOINT = "http://localhost:3000";

const crypt = new JSEncrypt({ default_key_size: 2056 })
const privateKey = crypt.getPrivateKey()

// Only return the public key, keep the private key hidden
const publicKey = crypt.getPublicKey();

const Chat = () => {
  //const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");



  const socketRef = useRef();

  function encryptMessage(message) {

    crypt.setKey(publicKey)
    return crypt.encrypt(message)

  }

  function decryptMessage(message) {

    crypt.setKey(message.key);
    return crypt.decrypt(message.message);
  }

  useEffect(() => {
    socketRef.current = io.connect(ENDPOINT);

    /*socketRef.current.on("your id", id => {
      setYourID(id);
    })*/

    socketRef.current.on("message", (message) => {
      console.log("here");
      receivedMessage(decryptMessage(message));
    })
  }, []);

  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
      body: message
    };
    setMessage("");
    socketRef.current.emit("chatMessage", {message: encryptMessage(messageObject.body), key: privateKey});
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1><i className="fas fa-smile"></i> ChatCord</h1>
        <a href="index.html" className="btn">Leave Room</a>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3><i className="fas fa-comments"></i> Room Name:</h3>
          <h2 id="room-name"></h2>
          <h3><i className="fas fa-users"></i> Users</h3>
          <ul id="users"></ul>
        </div>
        {messages.map(message => {
          return (
            <div className="chat-messages">{message}</div>
          )
        })}
      </main>
      <div className="chat-form-container">
        <form id="chat-form">
          <textarea
            id="msg"
            type="text"
            value={message}
            placeholder="Enter Message"
            required
            onChange={handleChange}
          />
          <button className="btn" onClick={sendMessage}><i className="fas fa-paper-plane"></i> Send</button>
        </form>
      </div>
    </div>
  )
}

export default Chat;
