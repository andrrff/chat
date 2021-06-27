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

app.set('port', (process.env.PORT || 3000));

server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
