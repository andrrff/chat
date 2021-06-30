const express = require("express"),
    app = express(),
    http = require("http"),
    server = http.createServer(app),
    { Server } = require("socket.io"),
    io = new Server(server),
    // siofu = require("socketio-file-upload"),
    fs = require('fs'),
    path = require('path');

app.use(express.static(__dirname));
app.get("/", (_req, res) => {
    res.sendFile(__dirname + "/view/index.html");
});

//Json.stringify()
var usocket = {},
    user = [];
var users = 0;

io.on("connection", (socket) => {
    socket.on("upload-image", function (message) {
        var writer = fs.createWriteStream(
            path.resolve(__dirname, "./tmp/" + message.name),
            {
                encoding: "base64",
            }
        );

        writer.write(message.data);
        writer.end();

        writer.on("finish", function () {
            socket.emit("image-uploaded", {
                name: "/tmp/" + message.name,
            });
        });
    });
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

    
    // var uploader = new siofu();
    // uploader.dir = __dirname + "/public/upload/images";
    // uploader.listen(socket);

    // uploader.on("saved", function (event) {
    //     // console.log(event.file);

    //     uploader.listen(socket);
    // });
});

app.set("port", process.env.PORT || 3000);
// app.use(express.static("public"));
// app.use(siofu.router);

server.listen(app.get("port"), function () {
    console.log("Node app is running on port", app.get("port"));
});
