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
    io = require("socket.io")(server, {
        cors: {
            origin: "*",
        },
    }),
    fs = require("fs"),
    path = require("path"),
    sharp = require("sharp");

const { ExpressPeerServer } = require("peer");
const { v4: uuidv4 } = require("uuid");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

console.log(peerServer)

app.set("view engine", "ejs");
// app.use("/peerjs", peerServer);
app.get("/call", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});
app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});
app.use(express.static(__dirname));
app.get("/", (_req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

//Data
var usocket = {},
    user = [], 
    id = [],
    messagesData = []

io.on("connection", (socket) => {
    //test
    socket.on("join-room", (roomId, userId) => {
        console.log("new user "+userId+" in room: " + roomId)
        socket.join(roomId); // Join the room
        socket.to(roomId).emit("user-connected", userId); // Tell everyone else in the room that we joined

        // Communicate the disconnection
        socket.on("disconnect", () => {
            socket.broadcast.emit("user-disconnected", userId);
        });
    });
    socket.on("recieve desktop", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit("recieve desktop media", userId); // Tell everyone else in the room that we joined
    })
    socket.on("video config", (userId, roomId, video, audio) => {
        socket.to(roomId).emit("config recieve", userId, video, audio); // Tell everyone else in the room that we joined
    })


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

    //Send a type message, `plain`, `jpeg`, ...
    socket.on("send element", (addressers, recipient, index) => {
        socket.emit("send element", addressers, recipient, index);
    });

    //Send message in `group`
    socket.on("chat message group", (msg, user, className) => {
        io.emit("chat message group", msg, user, className);
        //in public messages are not saved
        console.log("Public: " + user + " -> " + msg);
    });

    //Recieve address and send to address(private chat)
    socket.on("send message private", (message, address) => {
        console.log(message);
        messagesData.push(message);
        io.to(address).emit("selected", message);
    });

    //Resize image in server to client with broadcast
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

    //alert all users that a client has exited
    socket.on("disconnect", () => {
        if (socket.username in usocket) {
            delete usocket[socket.username];
            user.splice(user.indexOf(socket.username), 1);
        }
        socket.broadcast.emit("user left", socket.username);
        console.log(user);
    });
});

app.set("port", process.env.PORT || 3000);

server.listen(app.get("port"), () => {
    console.log("Node app is running on port", app.get("port"));
});
