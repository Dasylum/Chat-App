const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server,  {cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }});
const crypto = require('crypto');

app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, './chatapp/public/index.html')));

//create http server
io.on('connection', socket => {

    console.log("New WS connection");

    //Welcomes current user
    socket.emit('message', {message: "Welcome !!"});

    //Goes to everyone except the user who has joined
    socket.broadcast.emit('message', {message: "A user has entered the chat"});

    //When user diconnects
    socket.on('disconnect', () => {
        io.emit('message', "A user has disconnected");
    })

    //To recieve a message and display to everyone
    socket.on('chatMessage', (message) => {

        //console.log(message);

        io.emit("message", message)
    })
});

server.listen(3000, () => {
    console.log('server running on port 3000');
})