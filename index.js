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

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || "0.0.0.0";

app.listen(server_port, server_host, function () {
    console.log("Listening on port %d", server_port);
});