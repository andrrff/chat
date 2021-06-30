var socket = io();
var Swal = require("sweetalert2");
// var socket = io.connect();

var file = document.getElementById("my-file");
// var button = document.getElementById("button");

// button.addEventListener("click", () => 
// {
//     (async () => {
//         const { value: file } = await Swal.fire({
//             title: "Select image",
//             input: "file",
//             inputAttributes: {
//                 "accept": "image/*",
//                 "aria-label": "Upload your profile picture",
//             },
//         });

//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 Swal.fire({
//                     title: "Your uploaded picture",
//                     imageUrl: e.target.result,
//                     imageAlt: "The uploaded picture",
//                 });
//             };
//             reader.readAsDataURL(file);
//         }
//     })();
// })
// function open() {

// }

file.addEventListener("change", function () {
    if (!file.files.length) {
        return;
    }

    var firstFile = file.files[0],
        reader = new FileReader();

    reader.onloadend = function () {
        socket.emit("upload-image", {
            name: firstFile.name,
            data: reader.result,
        });
    };

    reader.readAsArrayBuffer(firstFile);
});

socket.on("chat message", (msg, user) => {
    socket.on("image-uploaded", function (message) {
        var item = document.createElement("li");
        Swal.fire({
            title: "Your uploaded picture",
            imageUrl: message.name,
            imageAlt: "The uploaded picture",
        });
        item.innerHTML =
            "<strong>" + user + "</strong>" + ": " + "<img src=\""+ message.name + "\" style=\"height: 100px\"/>" + "</div>";
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
});