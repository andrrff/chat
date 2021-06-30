var socket = io();

var messages = document.getElementById("messages");
var button = document.getElementById("button");
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
        "<strong>"+ user +"</strong>" + ": " + msg +"</div>";
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
})();

// files.addEventListener("onclick", file());
function file() {
    (async () => {
        const { value: file } = await Swal.fire({
            title: "Select image",
            input: "file",
            inputAttributes: {
                "accept": "image/*",
                "aria-label": "Upload your profile picture",
            },
        });
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                Swal.fire({
                    title: "Your uploaded picture",
                    imageUrl: e.target.result,
                    imageAlt: "The uploaded picture",
                });
            };
            // socket.on("chat message", (msg, user) => {
            //     var item = document.createElement("li");
            //     item.innerHTML =
            //         "<strong>" + user + "</strong>" + ": " + reader.readAsDataURL(file); + "</div>";
            //     messages.appendChild(item);
            //     window.scrollTo(0, document.body.scrollHeight);
            // });
        }
    })();
}