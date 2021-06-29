// const Swal = require('sweetalert2');
var socket = io();

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var username = document.getElementById("username");

(async () => {
    const { value: formValues } = await Swal.fire({
        title: "Welcome",
        html:
            '<input id="swal-input1" type="username" placeholder="username" class="swal2-input">',
        focusConfirm: true,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
            ];
        },
    });
    console.log("Bem-vindo " + formValues[0] + ", seja educado com os amiguinhos😊");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (input.value && formValues) {
            socket.emit("chat message", input.value, formValues[0]);
            input.value = "";
        }
    });
    
    socket.on("chat message", (msg, user) => {
        var item = document.createElement("li");
        item.textContent = user + ": " + msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
})();


