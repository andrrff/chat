const express = require("express"),
    app = express(),
    http = require("http"),
    server = http.createServer(app),
    { Server } = require("socket.io"),
    io = new Server(server),
    fs = require("fs"),
    path = require("path"),
    sharp = require("sharp");

app.use(express.static(__dirname));
app.get("/", (_req, res) => {
    res.sendFile(__dirname + "/view/index.html");
});

var usocket = {},user = [];

io.on("connection", (socket) => {
    socket.on("upload-image", function (message) {
        // io.emit("upload-image", message);
        var writer = fs.createWriteStream(
            path.resolve(__dirname, "./tmp/" + message.name),
            {
                encoding: "base64",
            }
        );
        
        (async () => { 
            sharp(message.data)
                .rotate()
                .resize(200)
                .jpeg({ mozjpeg: true })
                .toBuffer()
                .then( data => { console.log(data); writer.write(data); })
                .catch( err => { console.log(err) });
            writer.end();
    
            writer.on("finish", function () {
                socket.emit("image-uploaded", {
                    name: "/tmp/" + message.name,
                });
                console.log(message);
            });        
        })()
    });
    socket.on("new user", (username) => {
        if (!(username in usocket)) {
            socket.username = username;
            usocket[username] = socket;
            user.push(username);
            socket.emit("login", user);
            socket.broadcast.emit("user joined", username, user.length - 1);
            console.log(user);
        }
    });
    socket.on("send private message", function (res) {
        console.log(res);
        if (res.recipient in usocket) {
            usocket[res.recipient].emit("receive private message", res);
        }
    });
    socket.on("chat message", (msg, user) => {
        io.emit("chat message", msg, user);
        console.log("user: " + user + " -> " + msg);
    });
    socket.on("buffer", (object) => {
        sharp(object)
                .rotate()
                .resize(200)
                .jpeg({ mozjpeg: true })
                .toBuffer()
                .then( data => { console.log(data); io.emit("buffer", data); })
                .catch( err => { console.log(err) });
    });

    socket.on("disconnect", function () {
        if (socket.username in usocket) {
            delete usocket[socket.username];
            user.splice(user.indexOf(socket.username), 1);
        }
        console.log(user);
        socket.broadcast.emit("user left", socket.username);
    });

    socket.on("send private message", function (res) {
        console.log(res);
        if (res.recipient in usocket) {
            usocket[res.recipient].emit("receive private message", res);
        }
    });
});

app.set("port", process.env.PORT || 3000);

server.listen(app.get("port"), function () {
    console.log("Node app is running on port", app.get("port"));
});
