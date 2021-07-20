// const Swal = require("sweetalert2");

const socket = io("/"); // Create our socket
const videoGrid = document.getElementById("video-grid"); // Find the Video-Grid element
var videoMain = document.getElementById("video-main"); // Find the Video-Main element

const myPeer = new Peer(); // Creating a peer element which represents the current user
const myVideo = document.createElement("video"); // Create a new video tag to show our video
const myDesktop = document.createElement("video"); // Create a new video tag to show our video
var boolDesktop = false;
var videos = [];
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
            // call.answer(); // Stream them our video/audio
            call.answer(stream);
            const video = document.createElement("video"); // Create a video tag for them
            call.on("stream", (userVideoStream) => {
                // When we recieve their stream
                addVideoStream(video, userVideoStream, call.peer); // Display their video to ourselves
                // console.log(videos[0])
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
    socket.emit("join-room", ROOM_ID, id);
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

$(".desktop").on("click", () => {
    if (!boolDesktop) {
        startCapture().then((result) => {
            // myPeer.on("call", (call) => {
            //     call.answer(result);
            // })

        });
    } else {
        $(".desktop").css("background-color", "#5fb4ff");
        // myPeer.on("call", (call) => {
        //     call.answer(stopCapture());
        // });
        stopCapture()
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
            $(".desktop").css("background-color", "#ff6161");
    } catch (err) {
        console.error("Error: " + err);
    }
    return videoMain.children[0].srcObject;
}
function stopCapture(evt) {
    boolDesktop = false
    let tracks = videoMain.children[0].srcObject.getTracks();

    tracks.forEach((track) => track.stop());
    videoMain.children[0].srcObject = videoGrid.children[0].srcObject;
    return videoMain.children[0].srcObject;
}