const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var users = 0;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// io.emit("some event", {
//     someProperty: "some value",
//     otherProperty: "other value",
// });

io.on('connection', (socket) => {
  users++;
  console.log('User active: ' + users);
  socket.on('chat message', (msg, user) =>{
    io.emit("chat message", msg, user);
    console.log('user: '+ user + ' -> ' + msg);
  });
  socket.on('disconnect', () => {
      console.log('A user disconnected')
      users--;
      console.log("User active: " + users);
  })
});

app.set('port', (process.env.PORT || 3000));
app.use(express.static("public"));

server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
