var socket = io();
const { each } = require("jquery");
const md5 = require("md5");
const { Socket } = require("socket.io");
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

    console.log(
        "Bem-vindo " + formValues[0] + ", seja educado com os amiguinhos😊"
    );
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

    socket.on("load messages", (res) => {
        // console.log(res);
    });

    socket.on("user left", function (data) {
        if(data != null)
        {
            $("div." + md5(data)).remove();
        }
    });

    socket.on("select_chat", (addressers, recipient, index) => {
        if (input.value && formValues) {
            var req = {
                "addresser": formValues[0],
                "recipient": recipient,
                "type": "plain",
                "body": input.value,
            };
            // var className = "reverse";
            $(".chat-wrapper").append(
                '<div class="message-wrapper reverse"><div class="message-box-wrapper"><div class="message-box">' +
                    input.value +
                    "</div><span class=\""+recipient+"\">" +
                    formValues[0] +
                    "</span></div></div>"
            );
            socket.emit("log", req, addressers[index]);
        }
        input.value = '';
        console.log(addressers);
        console.log(addressers[index]);
    });

    socket.on('receive private message', function (data) {
        console.log("Voce recebeu uma mensagem uwu")
        var head = 'src/img/head.jpg';
        $(".chat-wrapper").append(
            '<div class="message-wrapper"' +
                '><div class="message-box-wrapper"><div class="message-box">' +
                data.body +
                "</div><span class='userAddresser'>" +
                data.addresser +
                "</span></div></div>"
        );
        // if(document.hidden){
        //     showNotice(head,data.addresser,data.body);
        // }
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
                            // console.log(el.textContent)
                            // console.log("Diferentes: " + index);
                            // console.log(el.className !== "");
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
                            // console.log("Iguais: " + index);
                            // console.log(el.className !== "");
                        }
                    });
                    // if( element != )
                    // console.log($("#columns-name").attr("class").attr("class"));
                    $("#usernameNav").text(element);
                    button.onclick = () => {
                        window.scrollTo(0, document.body.scrollHeight);
                        socket.emit("select_chat", users, sendName, index);
                    };
            });
            $("a.chat-public").on("click", () => {
                // console.log(formValues[0] + " -> Public");
                $("#usernameNav").text("Public");
                $("div.message-wrapper").find("span").each((index, el) => {
                    if (el.className !== "public") {
                            $(".chat-wrapper")[0]["children"][
                                index
                            ].hidden = true;
                            // console.log(el);
                    } else {
                        // console.log(el)
                        $(".chat-wrapper")[0]["children"][
                            index
                        ].hidden = false;
                    }
                })
                button.onclick = () => {
                    socket.emit("chat message", input.value, formValues[0], "");
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

    socket.on("chat message", (msg, user, className) => {
        if(user == formValues[0])
            className = "reverse";
       $(".chat-wrapper").append(
           '<div class="message-wrapper ' +
               className +
               '"><div class="message-box-wrapper"><div class="message-box">' +
               msg +
               '</div><span class="public">' +
               user +
               "</span></div></div>"
       );
    //    if (document.hidden) {
    //        showNotice("head", user, msg);
    //    }
        input.value = "";
        window.scrollTo(0, document.body.scrollHeight);
    });
})();


// function showNotice(head,title,msg){
//     var Notification = window.Notification || window.mozNotification || window.webkitNotification;
//     if(Notification){
//         Notification.requestPermission(function(status){
//             //status默认值'default'等同于拒绝 'denied' 意味着用户不想要通知 'granted' 意味着用户同意启用通知
//             if("granted" != status){
//                 return;
//             }else{
//                 var tag = "sds"+Math.random();
//                 var notify = new Notification(
//                     title,
//                     {
//                         dir:'auto',
//                         lang:'pt-BR',
//                         tag:tag,//实例化的notification的id
//                         icon:'/'+head,//通知的缩略图,//icon 支持ico、png、jpg、jpeg格式
//                         body:msg //通知的具体内容
//                     }
//                 );
//                 notify.onclick=function(){
//                     //如果通知消息被点击,通知窗口将被激活
//                     window.focus();
//                 },
//                 notify.onerror = function () {
//                     // console.log("HTML5桌面消息出错！！！");
//                 };
//                 notify.onshow = function () {
//                     setTimeout(function(){
//                         notify.close();
//                     },2000)
//                 };
//                 notify.onclose = function () {
//                     // console.log("HTML5桌面消息关闭！！！");
//                 };
//             }
//         });
//     }else{
//         // console.log("您的浏览器不支持桌面消息");
//     }
// };

// const constraints = {
//     "video": true,
//     "audio": true,
// };
// navigator.mediaDevices
//     .getUserMedia(constraints)
//     .then((stream) => {
//         console.log("Got MediaStream:", stream);
//     })
//     .catch((error) => {
//         console.error("Error accessing media devices.", error);
//     });