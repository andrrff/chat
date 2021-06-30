var socket = io();
var Swal = require("sweetalert2");
// var socket = io.connect();

var file = document.getElementById("my-file");
var messages = document.getElementById("messages");
var actionButton = document.getElementById("action");


file.addEventListener("change", () => {
    if (!file.files.length) {
        return;
    }

    var firstFile = file.files[0],
        reader = new FileReader();

    reader.onloadend = () => {
        socket.emit("upload-image", {
            name: firstFile.name,
            data: reader.result,
        });
        socket.emit("buffer", reader.result);
        console.log(reader.result);
    };

    reader.readAsArrayBuffer(firstFile);
});

// form.addEventListener("submit", function (e) {
//     e.preventDefault();
//     if (input.value && formValues) {
//         socket.emit("chat message", input.value, formValues[0]);
//         input.value = "";
//     }
// });

actionButton.addEventListener("click", () =>
{
    
});

socket.on("buffer", (buffer) =>
{
    var item = document.createElement("li");
    item.innerHTML =
        "<strong>" +
        "@user" +
        "</strong>: " +
        '<img src="' +
        "data:image/png;base64," +
        btoa(String.fromCharCode.apply(null, new Uint8Array(buffer))) +
        '" style="height: 100px"/>' +
        "</div>";
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    console.log("Done - ✅");
});

// socket.on("chat message", (msg, user) => {
socket.on("image-uploaded", (message) =>  {
    
    // var item = document.createElement("li");
    Swal.fire({
        title: "Your uploaded picture",
        imageUrl: message.name,
        imageAlt: "The uploaded picture",
    });
    // item.innerHTML =
    //     "<strong>" + "@user" + "</strong>: " + "<img src=\""+ message.name + "\" style=\"height: 100px\"/>" + "</div>";
    // messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
// });

// function toBase64(arr) {
//    //arr = new Uint8Array(arr) if it's an ArrayBuffer
//    return btoa(
//       arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
//    );
// }

// $('#two').prepend($('<img>',{id:'theImg2',src:`data:image/png;base64,${toBase64( selected[0].image2.data)}`}))