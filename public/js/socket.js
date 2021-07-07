var socket = io();
const { each } = require("jquery");
const md5 = require("md5");
const { Socket } = require("socket.io");
const Swal = require("sweetalert2");

var socket = io.connect();

var form = document.getElementById("chat");
var input = document.getElementById("input");

(async () => {
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

    socket.on("login", (user, id, username, address) => {
        // console.log(user);
        // console.log(id);
        // console.log(username);
        // console.log(address);
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

    socket.on("user joined", (user, address) => {
        var elements = user.toString().split(",");
        if (elements.length >= 1) {
            for (var i = 0; i < elements.length; i++) {
                if (formValues[0] != elements[i]) {
                    var currentUser = md5(elements[i]);
                    $("div.users").append(
                        '<div class="' +
                            currentUser +
                            '"><li class="li-sidemenu"><a class="' +
                            address +
                            '" href="#"><i class="fa fa-user"></i><span>' +
                            elements[i] +
                            '</span><span class="badge badge-pill badge-success">online</span></a></li></div>'
                    );
                }
            }
        }
        
    });

    socket.on("user left", function (data) {
        if(data != null)
        {
            $("div." + md5(data)).remove();
        }
    });

    socket.on("select_chat", (addressers) => {
        addressers.forEach((element) => {
            $("a." + element).on("click", () => {
                console.log(formValues[0] + " -> " + element);
                $("#chat").on("submit", (e) => {
                    console.log("submited");
                    if (input.value && formValues) {
                        var req = {
                            "addresser": formValues[0],
                            "type": "plain",
                            "body": input.value,
                        };
                        socket.emit("send private message", req, element);
                    }
                    e.preventDefault();
                    var className = "reverse";
                    $(".chat-wrapper").append(
                        '<div class="message-wrapper ' +
                            className +
                            '"><div class="message-box-wrapper"><div class="message-box">' +
                            input.value +
                            "</div><span>" +
                            formValues[0] +
                            "</span></div></div>"
                    );
                    input.value = '';
                });
            });
        });
    });

    socket.on('receive private message', function (data) {
        console.log("Voce recebeu uma mensagem uwu")
        var head = 'src/img/head.jpg';
        var className = ""
        if (data.recipient == formValues[0]) className = "reverse";
        $(".chat-wrapper").append(
            '<div class="message-wrapper ' +
                className +
                '"><div class="message-box-wrapper"><div class="message-box">' +
                data.body +
                "</div><span>" +
                data.addresser +
                "</span></div></div>"
        );
        if(document.hidden){
            showNotice(head,data.addresser,data.body);
        }
        window.scrollTo(0, document.body.scrollHeight);
	});

    socket.on("users", (users) => {
        socket.emit("select_chat", users);
    });    

    // socket.on("chat message", (msg, user, className) => {
    //     if(user == formValues[0])
    //         className = "reverse";
    //    $(".chat-wrapper").append(
    //        '<div class="message-wrapper '+className+'"><div class="message-box-wrapper"><div class="message-box">' +
    //            msg +
    //            "</div><span>"+user+"</span></div></div>"
    //    );
    //     window.scrollTo(0, document.body.scrollHeight);
    // });
})();


function showNotice(head,title,msg){
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    if(Notification){
        Notification.requestPermission(function(status){
            //status默认值'default'等同于拒绝 'denied' 意味着用户不想要通知 'granted' 意味着用户同意启用通知
            if("granted" != status){
                return;
            }else{
                var tag = "sds"+Math.random();
                var notify = new Notification(
                    title,
                    {
                        dir:'auto',
                        lang:'zh-CN',
                        tag:tag,//实例化的notification的id
                        icon:'/'+head,//通知的缩略图,//icon 支持ico、png、jpg、jpeg格式
                        body:msg //通知的具体内容
                    }
                );
                notify.onclick=function(){
                    //如果通知消息被点击,通知窗口将被激活
                    window.focus();
                },
                notify.onerror = function () {
                    console.log("HTML5桌面消息出错！！！");
                };
                notify.onshow = function () {
                    setTimeout(function(){
                        notify.close();
                    },2000)
                };
                notify.onclose = function () {
                    console.log("HTML5桌面消息关闭！！！");
                };
            }
        });
    }else{
        console.log("您的浏览器不支持桌面消息");
    }
};