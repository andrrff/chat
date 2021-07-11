var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;
global.document = document;

var $ = (jQuery = require("jquery")(window));

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

var usocket = {},
    user = [], 
    id = [],
    messagesData = [];

io.on("connection", (socket) => {
    socket.on("upload-image", (message) => {
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
                .then((data) => {
                    console.log(data);
                    writer.write(data);
                })
                .catch((err) => {
                    console.log(err);
                });
            writer.end();

            writer.on("finish", () => {
                socket.emit("image-uploaded", {
                    name: "/tmp/" + message.name,
                });
                console.log(message);
            });
        })();
    });
    socket.on("new user", (username, address) => {
        socket.emit("new user", username, address);
        if (!(username in usocket)) {
            socket.username = username;
            usocket[username] = socket;
            user.push(username);
            id.push(socket.id);
            io.emit("login", user, id);
            io.emit("load messages", messagesData);
            io.emit("users", id, user);
            console.log(user);
        }
    });

    socket.on("select_chat", (user, username, index) => {
        socket.emit("select_chat", user, username, index);
    });

    socket.on("chat message", (msg, user, className) => {
        io.emit("chat message", msg, user, className);
        console.log("user: " + user + " -> " + msg);
    });

    socket.on("buffer", (object) => {
        sharp(object)
            .rotate()
            .resize(200)
            .jpeg({ mozjpeg: true })
            .toBuffer()
            .then((data) => {
                console.log(data);
                io.emit("buffer", data);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    socket.on("disconnect", () => {
        if (socket.username in usocket) {
            delete usocket[socket.username];
            user.splice(user.indexOf(socket.username), 1);
        }
        socket.broadcast.emit("user left", socket.username);
        console.log(user);
    });

    socket.on("send private message", (res, address) => {
        // socket.emit("send private message", res, address);
        console.log(res);
        messagesData.push(res);
        console.log(messagesData);
        // $("#submit").on("click", () => {
            io.to(address).emit("receive private message", res);
        // });
    });

    socket.on("log", (message, address) => {
        console.log(message);
        io.to(address).emit("selected", message);
        // io.to(address).emit("receive private message", message);
    })
});

app.set("port", process.env.PORT || 3000);

server.listen(app.get("port"), function () {
    console.log("Node app is running on port", app.get("port"));
});
