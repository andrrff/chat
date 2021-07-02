(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// var socket = io();
// var Swal = require("sweetalert2");

// var file = document.getElementById("my-file");
// var messages = document.getElementById("messages");


// file.addEventListener("change", () => {
//     if (!file.files.length) {
//         return;
//     }

//     var firstFile = file.files[0],
//         reader = new FileReader();

//     reader.onloadend = () => {
//         socket.emit("upload-image", {
//             name: firstFile.name,
//             data: reader.result,
//         });
//         socket.emit("buffer", reader.result);
//     };

//     reader.readAsArrayBuffer(firstFile);
// });

// socket.on("buffer", (buffer) =>
// {
//     // $(".chat-wrapper").append(
//     //     '<div class="message-wrapper ' +
//     //         " " +
//     //         '"><div class="message-box-wrapper"><div class="message-box">' +
//     //         '<img id="open-image" src="' +
//     //         "data:image/png;base64," +
//     //         btoa(String.fromCharCode.apply(null, new Uint8Array(buffer))) +
//     //         '" style="height: 100px"/>' +
//     //         "</div><span>" +
//     //         "@user" +
//     //         "</span></div></div>"
//     // );
//     var item = document.createElement("li");
//     item.innerHTML =
//         "<strong>" +
//         "@user" +
//         "</strong>: " +
//         '<a href="#'+new Uint8Array(buffer)+'">' +
//         '<img id="open-image" src="' +
//         "data:image/png;base64," +
//         btoa(String.fromCharCode.apply(null, new Uint8Array(buffer))) +
//         '" style="height: 100px"/>' +
//         "</a>" +
//         '<a href="#" class="lightbox" id="'+new Uint8Array(buffer)+'">' +
//         '<span style="' +
//         "background-image: url(data:image/png;base64," +
//         btoa(String.fromCharCode.apply(null, new Uint8Array(buffer))) +
//         ')"/>' +
//         "</span>";
//         "</a>" +
//         "</div>";
//     messages.appendChild(item);
//     Swal.fire({
//         title: "Look what they sent you",
//         imageUrl:
//             "data:image/png;base64," +
//             btoa(String.fromCharCode.apply(null, new Uint8Array(buffer))),
//         imageAlt: "The uploaded picture",
//     });
//     window.scrollTo(0, document.body.scrollHeight);
//     console.log("Done - ✅");
// });

// // socket.on("chat message", (msg, user) => {
// socket.on("image-uploaded", (message) =>  {
    
//     // var item = document.createElement("li");
//     // Swal.fire({
//     //     title: "Your uploaded picture",
//     //     imageUrl: message.name,
//     //     imageAlt: "The uploaded picture",
//     // });
//     // item.innerHTML =
//     //     "<strong>" + "@user" + "</strong>: " + "<img src=\""+ message.name + "\" style=\"height: 100px\"/>" + "</div>";
//     // messages.appendChild(item);
//     window.scrollTo(0, document.body.scrollHeight);
// });
// // });
},{}]},{},[1]);
