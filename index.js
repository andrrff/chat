const express = require("express"),
    app = express(),
    http = require("http"),
    server = http.createServer(app),
    { Server } = require("socket.io"),
    io = new Server(server);

//Json.stringify()
var usocket = {},
    user = [];
var users = 0;

app.get("/", (_req, res) => {
    res.sendFile(__dirname + "/view/index.html");
});

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
});

app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));

server.listen(app.get("port"), function () {
    console.log("Node app is running on port", app.get("port"));
});
