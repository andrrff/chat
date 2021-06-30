const express = require("express"),
    app = express(),
    http = require("http"),
    server = http.createServer(app),
    { Server } = require("socket.io"),
    io = new Server(server),
    fs = require("fs"),
    path = require('path');
    siofu = require("socketio-file-upload");

var values;
const directoryPath = path.join(__dirname, "public/upload/images/");
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(JSON.stringify(files));
    });
});
app.get("/", (_req, res) => {
    res.sendFile(__dirname + "/view/index.html");
});

// console.log(JSON.stringify(values));

//Json.stringify()
var usocket = {},
    user = [];
var users = 0;

io.on("connection", (socket) => {
    users++;
    console.log("User active: " + users);
    socket.on("chat message", (msg, user) => {
        io.emit("chat message", msg, user);
        console.log("user: " + user + " -> " + msg);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
        users--;
        console.log("User active: " + users);
    });

    socket.on("send private message", function (res) {
        console.log(res);
        if (res.recipient in usocket) {
            usocket[res.recipient].emit("receive private message", res);
        }
    });

    
    var uploader = new siofu();
    uploader.dir = __dirname + "/public/upload/images";
    uploader.listen(socket);

    uploader.on("saved", function (event) {
        // console.log(event.file);

        uploader.listen(socket);
    });
});

app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));
app.use(siofu.router);

server.listen(app.get("port"), function () {
    console.log("Node app is running on port", app.get("port"));
});
