var socket = io();

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var username = document.getElementById("username");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value && username.value) {
        socket.emit("chat message", input.value, username.value);
        username.value = username.value;
        input.value = "";
    }
});

socket.on("chat message", (msg, user) => {
    var item = document.createElement("li");
    item.textContent = user + ": " + msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
