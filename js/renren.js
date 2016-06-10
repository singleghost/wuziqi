/**
 *
 * Created by root on 16-6-8.
 */

//初始化部分
var debug = true;
var username;
var myColor;
var over = true;
var waitfor = true;
var chess = document.getElementById('chess');
var context = chess.getContext('2d');

var chessBoard = [];

//初始化棋盘数组， 0为空， 1为people， 2为computer
var initChess = function () {
    for (var i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (var j = 0; j < 15; j++) {
            chessBoard[i][j] = 0;
        }
    }
};

//判断人或电脑是否赢棋
var judgeWin = function (color) {
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (chessBoard[i][j] != color) {
                continue;
            }
            var oneDirec = 0;
            var anoDirec = 0;
            for (var x = i - 1; x > i - 5 && x >= 0; x--) {
                if (chessBoard[x][j] == color) {
                    oneDirec++;
                } else {
                    break;
                }
            }
            for (var x = i + 1; x < i + 5 && x < 15; x++) {
                if (chessBoard[x][j] == color) {
                    anoDirec++;
                } else {
                    break;
                }
            }
            var judge = function () {
                var totalNum = oneDirec + anoDirec + 1;
                if (totalNum == 5) {
                    return true;
                }
            };
            if (judge()) return true;

            //纵向
            var oneDirec = 0;
            var anoDirec = 0;
            for (var x = j - 1; x > j - 5 && x >= 0; x--) {
                if (chessBoard[i][x] == color) {
                    oneDirec++;
                } else {
                    break;
                }
            }
            for (var x = j + 1; x < j + 5 && x < 15; x++) {
                if (chessBoard[i][x] == color) {
                    anoDirec++;
                } else {
                    break;
                }
            }
            if (judge()) return true;

            //对角线
            var oneDirec = 0;
            var anoDirec = 0;
            for (var x = i - 1, y = j - 1; x > i - 5 && x >= 0 && y > j - 5 && y >= 0; x--, y--) {
                if (chessBoard[x][y] == color) {
                    oneDirec++;
                } else {
                    break;
                }
            }
            for (var x = i + 1, y = j + 1; x < i + 5 && x < 15 && y < j + 5 && y < 15; x++, y++) {
                if (chessBoard[x][y] == color) {
                    anoDirec++;
                } else {
                    break;
                }
            }
            if (judge()) return true;

            //反对角线
            var oneDirec = 0;
            var anoDirec = 0;
            for (var x = i + 1, y = j - 1; x < i + 5 && x < 15 && y > j - 5 && y >= 0; x++, y--) {
                if (chessBoard[x][y] == color) {
                    oneDirec++;
                } else {
                    break;
                }
            }
            for (var x = i - 1, y = j + 1; x > i - 5 && x >= 0 && y < j + 5 && y < 15; x--, y++) {
                if (chessBoard[x][y] == color) {
                    anoDirec++;
                } else {
                    break;
                }
            }
            if (judge()) return true;

        }
    }
};

initChess();
context.strokeStyle = "#BFBFBF";

//Logo 部分
var logo = new Image();
logo.src = "images/logo.png";
//画logo
logo.onload = function () {
    // context.drawImage(logo, 0, 0, 450, 450);
    drawLines();
};


var sendmsg = function (msg, type) {
    var data = JSON.stringify({"msg": msg, "type": type});
    console.log("发送数据给服务器" + data);
    ws.send(data);
};
window.onload = function () {
    username = prompt("请输入您的尊姓大名", "随便");
    sendmsg(username, "setUsername");
};
chess.onclick = function (e) {
    if (!over && !waitfor) {
        var x = (e.offsetX || e.pageX - $(e.target).offset().left);
        var y = (e.offsetY || e.pageY - $(e.target).offset().top);
        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);
        if (chessBoard[i][j] == 0) {
            onestep(i, j, myColor);
            var data = {"x": i, "y": j, "color": myColor, "type": "fall"};
            console.log("send data to server:" + JSON.stringify(data));
            ws.send(JSON.stringify(data));
            waitfor = true;
            if (judgeWin(myColor)) {
                over = true;
                alert("You win");
                prepare_btn.disabled = false;
                restart_btn.disabled = false;
                var data = {"msg" : "gameover", "type" : "control"};
                ws.send(JSON.stringify(data));
            }
        }
    }

};

var drawLines = function () {

    for (var i = 0; i < 15; i++) {
        //画横线
        context.moveTo(15, 15 + i * 30);
        context.lineTo(435, 15 + i * 30);
        context.stroke();
        //画竖线 
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 435);
        context.stroke();
    }

};

var onestep = function (i, j, color) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13,
        15 + i * 30 + 2, 15 + j * 30 - 2, 3);
    if (color === "black") {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
    } else if (color === "white") {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }
    chessBoard[i][j] = color;
    context.fillStyle = gradient;
    context.fill();

};

var addNotice = function (msg) {
    var notices = document.getElementById("notices");
    var new_notice = document.createElement("li");
    new_notice.innerHTML = msg;
    notices.appendChild(new_notice);
};
//websocket 部分
//生成websocket连接，并设置好各个回调函数
var ws;
var ws_init = function () {
    if(debug) {
        var wsServer = 'ws://127.0.0.1:60000';
    } else {
        var wsServer = 'ws://114.215.85.18:60000';
    }
    ws = new WebSocket(wsServer);
    var isConnect = false;
    ws.onopen = function (evt) {
        onOpen(evt)
    };
    ws.onclose = function (evt) {
        onClose(evt)
    };
    ws.onmessage = function (evt) {
        onMessage(evt)
    };
    ws.onerror = function (evt) {
        onError(evt)
    };
    function onOpen(evt) {
        console.log("连接服务器成功");
        isConnect = true;
    }

    function onClose(evt) {
        console.log("Disconnected");
        ws.close();
    }

    function onMessage(evt) {
        console.log(JSON.stringify(evt.data));
        var data = JSON.parse(evt.data);
        switch (data.type) {
            case 'fall':
                //有一方落子，服务器会通知另一方落子的位置
                var fallInfo = JSON.parse(data.msg);
                onestep(fallInfo.x, fallInfo.y, fallInfo.color);
                waitfor = false;
                if (judgeWin(fallInfo.color)) {
                    over = true;
                    alert("Your opposite Win!");
                    prepare_btn.disabled = false;
                    restart_btn.disabled = false;
                    sendmsg("gameover", "control");
                }
                break;
            case 'tellcolor':
                //双方都点击准备之后，服务器会向每个客户端发送一个tellcolor命令
                myColor = data.msg;
                var notice = "你所持为" + ((myColor == "black") ? "黑棋" : "白棋");
                addNotice(notice);

                break;
            case 'control':
                if (data.msg === "gameBegin") {
                    //双方都点击准备之后，服务器会向每个客户端发送一个gameBegin命令
                    over = false;
                    context.clearRect(0, 0, 450, 450);
                    drawLines();
                    initChess();
                    if (myColor == "black") {
                        waitfor = false; //黑棋先走
                    } else if (myColor == "white") {
                        waitfor = true;
                    }

                }
                break;
            case 'notice':
                //有玩家加入或离开会有来自服务器的消息提示
                addNotice(data.msg);
                break;
            case 'chat':
                $("#message")[0].value += data.msg;
                $("#message")[0].scrollTop = $('#message')[0].scrollHeight;
        }

        console.log('Retrieved data from server: ' + JSON.stringify(evt.data));
    }

    function onError(evt) {
        console.log('Error occured: ' + evt.data);
    }

};
ws_init();


//按钮部分，设置回调函数
$("#sub")[0].onclick = function () {
    var msg = $("#input")[0].value;
    sendmsg(msg, "chat");
    $("#input").value = "";
};

var searchop_btn = document.getElementById("search");
searchop_btn.onclick = function (e) {
    sendmsg("searchforOp", "control");
};

var disconnect_btn = document.getElementById("disconnect");
disconnect_btn.onclick = function (e) {
    ws.close();
};

var prepare_btn = document.getElementById("prepare");
prepare_btn.onclick = function (e) {
    prepare_btn.disabled = true;
    sendmsg("isReady", "control");
};

var restart_btn = document.getElementById("restart");
restart_btn.onclick = function (e) {
    //把棋盘恢复到初始状态
    context.clearRect(0, 0, 450, 450);
};

