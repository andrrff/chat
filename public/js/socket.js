var socket = io();
const md5 = require("md5");
const Swal = require("sweetalert2");

var socket = io.connect();

var button = document.getElementById("submit");
var input = document.getElementById("input");


(async () => {
    await Swal.fire("Informativo", "Ainda está em produção, por isso ainda tem alguns bugs à serem concertados. Muita coisa ainda falta ser implementada, mas mesmo assim obrigado pela visita ❤", "info");
    const { value: formValues } = await Swal.fire({
        title: "Welcome to Chat-Andrrff",
        html: '<input id="swal-input1" type="username" placeholder="username" class="swal2-input">',
        customClass: {
            htmlContainer: "style='display: inline-table'",
        },
        preConfirm: () => {
            return [document.getElementById("swal-input1").value];
        },
    });

    console.log("Bem-vindo " + formValues[0] + ", seja educado com os amiguinhos😊");
    $("span.user-name").text(formValues[0]);
    socket.emit("new user", formValues[0], socket.id);

    socket.on("login", (user, id) => {
        $("div.users").empty();
        var elements = user.toString().split(",");
        var elementsId = id.toString().split(",");
        if (elements.length >= 1) {
            for (var i = 0; i < elements.length; i++) {
                if(formValues[0] != elements[i])
                {
                    var currentUser = md5(elements[i]);
                    $("div.users").append(
                        '<div class="' +
                            currentUser +
                            '"><li class="li-sidemenu"><a class="' +
                            elementsId[i] +
                            '" href="#"><i class="fa fa-user"></i><span>' +
                            elements[i] +
                            '</span><span class="badge badge-pill badge-success">online</span></a></li></div>'
                    );
                }
            }
        }
    });

    socket.on("send element", (addressers, recipient, index) => {
        if (input.value && formValues) {
            var req = {
                "addresser": formValues[0],
                "recipient": recipient,
                "type": "plain",
                "body": input.value,
                "time": new Date()
            };
            // var className = "reverse";
            $(".chat-wrapper").append(
                '<div class="message-wrapper reverse"><div class="message-box-wrapper"><div class="message-box">' +
                    input.value +
                    "</div><span class=\""+recipient+"\">" +
                    formValues[0] +
                    "</span></div></div>"
            );
            socket.emit("send message private", req, addressers[index]);
        }
        input.value = '';
        console.log("Avaliables users: ", addressers);
        console.log("Send message to [id]: ", addressers[index]);
    });

    socket.on("load messages", (res) => {
        // em breve
    });

    socket.on("chat message group", (msg, user, className) => {
        if (user == formValues[0]) className = "reverse";
        $(".chat-wrapper").append(
            '<div class="message-wrapper ' +
                className +
                '"><div class="message-box-wrapper"><div class="message-box">' +
                msg +
                '</div><span class="public">' +
                user +
                "</span></div></div>"
        );
        input.value = "";
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('receive private message', function (data) {
        console.log("Voce recebeu uma mensagem uwu")
        $(".chat-wrapper").append(
            '<div class="message-wrapper"' +
                '><div class="message-box-wrapper"><div class="message-box">' +
                data.body +
                "</div><span class='userAddresser'>" +
                data.addresser +
                "</span></div></div>"
        );
        window.scrollTo(0, document.body.scrollHeight);
	});

    socket.on("users", (users, username) => {
        var sendName;
        var elements = username.toString().split(",");
        elements.forEach((element, index) => {
            $("div." + md5(element)).on("click", () => {
                window.scrollTo(0, document.body.scrollHeight);
                    sendName = element;
                    console.log("Clicou em " + sendName)
                    $("div.message-wrapper").find("span").each((index, el) => {
                        if (element != el.textContent && el.className === "") {
                            $(".chat-wrapper")[0]["children"][
                                index
                            ].hidden = true;
                        } else {
                            if(element === el.className)
                            {
                                $(".chat-wrapper")[0]["children"][
                                    index
                                ].hidden = false;
                            }
                            else if(el.className === "")
                            {
                                $(".chat-wrapper")[0]["children"][
                                    index
                                ].hidden = false;
                            }
                            else
                            {
                                $(".chat-wrapper")[0]["children"][
                                    index
                                ].hidden = true;
                            }
                        }
                    });
                    $("#usernameNav")
                        .text(element)
                    button.onclick = () => {
                        window.scrollTo(0, document.body.scrollHeight);
                        socket.emit("send element", users, sendName, index);
                    };
            });
            $("a.chat-public").on("click", () => {
                $("#usernameNav").text("Public");
                $("div.message-wrapper").find("span").each((index, el) => {
                    if (el.className !== "public") {
                            $(".chat-wrapper")[0]["children"][
                                index
                            ].hidden = true;
                    } else {
                        $(".chat-wrapper")[0]["children"][
                            index
                        ].hidden = false;
                    }
                })
                button.onclick = () => {
                    socket.emit("chat message group", input.value, formValues[0], "");
                    input.value = "";
                };
            });
        });
    });

    socket.on("selected", (message) => {
        console.log("Voce foi selecionado " + message)
        window.scrollTo(0, document.body.scrollHeight);
        $(".chat-wrapper").append(
            '<div class="message-wrapper ' +
                '"><div class="message-box-wrapper"><div class="message-box">' +
                message.body +
                "</div><span>" +
                message.addresser+
                "</span></div></div>"
        );
    })

    socket.on("user left", function (data) {
        if (data != null) {
            $("div." + md5(data)).remove();
        }
    });
})();