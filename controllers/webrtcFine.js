(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// const Swal = require("sweetalert2");

const socket = io("/"); // Create our socket
const videoGrid = document.getElementById("video-grid"); // Find the Video-Grid element
var videoMain = document.getElementById("video-main"); // Find the Video-Main element

const myPeer = new Peer(); // Creating a peer element which represents the current user
const myPeerMedia = new Peer();
const myVideo = document.createElement("video"); // Create a new video tag to show our video
const myDesktop = document.createElement("video"); // Create a new video tag to show our video
var boolDesktop = false;
var boolMicrofone = false;
var boolCamera = false;
var videoUser = "iam";
myVideo.className = "iam";

myVideo.addEventListener("click", () => {
    videoMain.children[0].srcObject = myVideo.srcObject;
});
myVideo.muted = true; // Mute ourselves on our end so there is no feedback loop

// Access the user's video and audio
navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        addVideoStream(myVideo, stream, myVideo.className); // Display our video to ourselves

        myPeer.on("call", (call) => {
            // When we join someone's room we will receive a call from them
            // Stream them our video/audio
            call.answer(stream);
            const video = document.createElement("video"); // Create a video tag for them
            call.on("stream", (userVideoStream) => {
                // console.log(videoUser.id)
                    addVideoStream(video, userVideoStream, call.peer); // Display their video to ourselves
                videoUser = userVideoStream;
            });
        });

        socket.on("user-connected", (userId) => {
            console.log("user connected: ", userId);
            connectToNewUser(userId, stream);
        });
        socket.on("user-disconnected", (userId) => {
            // If a new user connect
            $("video." + userId).remove();
            console.log("user disconenected: ", userId);
        });
    });

myPeer.on("open", (id) => {
    // When we first open the app, have us join a room
    $("button.video").on("click", () => {
        boolCamera = !boolCamera;
        if (boolCamera)
        {
            $("button.video").css("background-color", "#ff6161");
            $("button.video").html('<i class="fas fa-video-slash"></i>');
        }
        else
        {
            $("button.video").css("background-color", "#5fb4ff");
            $("button.video").html('<i class="fas fa-video"></i>');
        }
        console.log("camera: " + boolCamera + " audio: " + boolMicrofone);
        socket.emit("video config", id, ROOM_ID, boolCamera, boolMicrofone);
    });
    $("button.microfone").on("click", () => {
        boolMicrofone = !boolMicrofone;
        if (boolMicrofone) {
            $("button.microfone").css("background-color", "#ff6161");
            $("button.microfone").html('<i class="fas fa-microphone-slash"></i>');
        } else {
            $("button.microfone").css("background-color", "#5fb4ff");
            $("button.microfone").html('<i class="fas fa-microphone"></i>');
        }
        console.log("camera: "+ boolCamera + " audio: "+ boolMicrofone);
        socket.emit("video config", id, ROOM_ID, boolCamera, boolMicrofone);
    });
    socket.emit("join-room", ROOM_ID, id);
});

socket.on("config recieve", (userId, video, audio) => {
    console.log("user: "+userId+"camera: " + video + " audio: " + audio);
    $("video." + userId)[0].pause = video;
    $("video." + userId)[0].muted = audio;
});

function connectToNewUser(userId, stream) {
    // This runs when someone joins our room
    const call = myPeer.call(userId, stream); // Call the user who just joined
    // Add their video
    const video = document.createElement("video");
    // video.className = userId;
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream, userId);
    });
    // If they leave, remove their video
    call.on("close", () => {
        video.remove();
    });
}

function connectToNewMedia(userId, stream)
{
    const calldesktop = myPeer.call(userId, stream);
    // Add their video
    const video = document.createElement("video");
    // video.className = userId;
    calldesktop.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream, userId);
    });
    // If they leave, remove their video
    calldesktop.on("close", () => {
        video.remove();
    });
}

function addVideoStream(video, stream, className) {
    video.srcObject = stream;
    video.className = className;
    $("video." + className).on("click", () => {
        videoMain.children[0].srcObject = video.srcObject;
        // video.style.border
    });
    video.addEventListener("loadedmetadata", () => {
        // Play the video as it loads
        video.play();
    });
    videoGrid.append(video); // Append video element to videoGrid
    videoMain.children[0].srcObject = stream; //Video principal
}

$(".quit").on("click", () => {
    window.close();
})

$(".view-gallery").on("click", () => {
    if (videoMain.hidden) {
        videoMain.hidden = false;
        // videoGrid.hidden = true;
        videoGrid.style.removeProperty("display");
        videoGrid.style.border;
    } else {
        videoMain.hidden = true;
        // videoGrid.hidden = false;
        videoGrid.style.display = "inline-block";
    }
});

var elem = document.getElementById("videoMain");
elem.addEventListener("click", () => {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
})

socket.on("recieve desktop media", () => {
    console.log("reload");
    window.location.reload();
});

// When we first open the app, have us join a room
$("button.desktop").on("click", () => {
    if (!boolDesktop) {
        startCapture().then((stream) => {
            videoMain.children[0].srcObject = stream;
            addVideoStream(
                document.createElement("video"),
                stream,
                "desktop"
            ); // Display our video to ourselves
            $("video.desktop")[0].muted = true;
            myPeer.on("call", (call) => {
                call.answer(stream);
            });

            socket.on("user-connected", (userId) => {
                console.log("user connected: ", userId);
                connectToNewMedia(userId, stream);
            });
            socket.emit("recieve desktop", ROOM_ID);
        });
    } else {
        $("button.desktop").css("background-color", "#5fb4ff");
        stopCapture()
        window.location.reload();
    }
}); 

async function startCapture() {
    boolDesktop = true;
    try {
        videoMain.children[0].srcObject =
            await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always" | "motion" | "never",
                    displaySurface:
                        "application" | "browser" | "monitor" | "window",
                },
                audio: true,
            });
            $("button.desktop").css("background-color", "#ff6161");
    } catch (err) {
        console.error("Error: " + err);
    }
    videoMain.muted = false;
    return videoMain.children[0].srcObject;
}
function stopCapture() {
    boolDesktop = false
    let tracks = document.querySelector("video.desktop").srcObject.getTracks();

    tracks.forEach((track) => track.stop());
    videoMain.children[0].srcObject = videoGrid.children[0].srcObject;
    $("video.desktop").remove();
    videoMain.muted = true;
    return videoMain.children[0].srcObject;
}
},{}]},{},[1]);
