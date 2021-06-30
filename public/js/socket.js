// var express = require("express");
// var router = express.Router();
var socket = io();
// var SocketIOFileUpload = require("socketio-file-upload");
const Swal = require("sweetalert2");
    // fs = require("browserify-fs"),
    // path = require("path");
var imgChunks = [];


var socket = io.connect();
// var uploader = new SocketIOFileUpload(socket);

// uploader.listenOnInput(document.getElementById("file"));

// var button = document.getElementById("button");
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");

(async () => {
    const { value: formValues } = await Swal.fire({
        title: "Welcome to Chat-Andrrff",
        html: '<input id="swal-input1" type="username" placeholder="username" class="swal2-input">',
        preConfirm: () => {
            return [document.getElementById("swal-input1").value];
        },
    });

    console.log(
        "Bem-vindo " + formValues[0] + ", seja educado com os amiguinhos😊"
    );
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (input.value && formValues) {
            socket.emit("chat message", input.value, formValues[0]);
            input.value = "";
        }
    });

    socket.on("chat message", (msg, user) => {
        var item = document.createElement("li");
        item.innerHTML =
            "<strong>" + user + "</strong>" + ": " + msg + "</div>";
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
})();
