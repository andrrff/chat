const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// io.emit("some event", {
//     someProperty: "some value",
//     otherProperty: "other value",
// });

io.on('connection', (socket) => {
  console.log('a user intereact');
  socket.on('chat message', (msg, user) =>{
    io.emit("chat message", msg, user);
    console.log('user: '+ user + ' -> ' + msg);
  });
  socket.on('disconnect', () => {
      console.log('a user disconnected')
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});