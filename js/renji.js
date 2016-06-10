/**
 *
 * Created by root on 16-6-7.
 */
var over = false;
var me = true;
var chess = document.getElementById('chess');
var context = chess.getContext('2d');

var chessBoard = [];

const people = 1;
const comp = 2;

//初始化棋盘数组， 0为空， 1为people， 2为computer
var initChess = function() {
    for (var i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (var j = 0; j < 15; j++) {
            chessBoard[i][j] = 0;
        }
    }
};
initChess();

var values = []; //估值网络
//初始化估值数组
var initValues = function () {
    for (var i = 0; i < 15; i++) {
        values[i] = [];
        for (var j = 0; j < 15; j++) {
            values[i][j] = [];
            for (var k = 0; k < 2; k++) {
                values[i][j][k] = 0;
            }
        }
    }
};
initValues();

//计算机落子
var computerFall = function () {
    var fx, fy;
    var maxValue = -100;
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if(chessBoard[i][j] != 0) {
                continue;
            }
            values[i][j][0] = calcValue(i, j, people);
            if (values[i][j][0] > maxValue) {
                maxValue = values[i][j][0];
                fx = i;
                fy = j;
            }
            values[i][j][1] = calcValue(i, j, comp);
            if (values[i][j][1] > maxValue) {
                maxValue = values[i][j][1];
                fx = i;
                fy = j;
            }
        }
    }
    onestep(fx, fy, me);
};
//计算盘面上某个点的价值
var calcValue = function (i, j, role) {
    var value = 0;

    var addTotalValue = function (num) {
        switch (num) {
            case 1:
                if(oneBoard && anoBoard) value += 0;
                else if(!oneBoard && !anoBoard) value += 100;
                else value += 50;
                break;
            case 2:
                if(oneBoard && anoBoard) value += 0;
                else if(!oneBoard && !anoBoard) value += 300;
                else value += 100;
                break;
            case 3:
                if(oneBoard && anoBoard) value += 0;
                else if(!oneBoard && !anoBoard) value += 1000;
                else value += 500;
                break;
            case 4:
                if(oneBoard && anoBoard) value += 0;
                else if(!oneBoard && !anoBoard) value += 10000;
                else value += 1500;
                break;
            case 5:
                value += 100000;
                break;
        }

    };
    //横向
    var oneDirec = 0;
    var anoDirec = 0;
    var oneBoard = false;
    var anoBoard = false;
    for (var x = i - 1; x > i - 5 && x >= 0; x--) {
        if (chessBoard[x][j] == role) {
            oneDirec++;
        }  else if(chessBoard[x][j] != 0){
            oneBoard = true;
            break;
        } else {
            break;
        }
    }
    for (var x = i + 1; x < i + 5 && x < 15; x++) {
        if (chessBoard[x][j] == role) {
            anoDirec++;
        }  else if(chessBoard[x][j] != 0){
            anoBoard = true;
            break;
        } else {
            break;
        }
    }
    totalNum = oneDirec + anoDirec + 1;
    addTotalValue(totalNum);
    //纵向
    var oneDirec = 0;
    var anoDirec = 0;
    var oneBoard = false;
    var anoBoard = false;
    for (var x = j - 1; x > j - 5 && x >= 0; x--) {
        if (chessBoard[i][x] == role) {
            oneDirec++;
        } else if(chessBoard[i][x] != 0){
            oneBoard = true;
            break;
        } else {
            break;
        }
    }
    for (var x = j + 1; x < j + 5 && x < 15; x++) {
        if (chessBoard[i][x] == role) {
            anoDirec++;
        } else if(chessBoard[i][x] != 0){
            anoBoard = true;
            break;
        } else {
            break;
        }
    }
    totalNum = oneDirec + anoDirec + 1;
    addTotalValue(totalNum);

    //对角线
    var oneDirec = 0;
    var anoDirec = 0;
    var oneBoard = false;
    var anoBoard = false;
    for (var x = i-1, y=j-1; x > i - 5 && x >= 0 && y > j - 5 && y >= 0; x--, y--) {
        if (chessBoard[x][y] == role) {
            oneDirec++;
        } else if(chessBoard[x][y] != 0){
            oneBoard = true;
            break;
        } else {
            break;
        }
    }
    for (var x = i+1, y=j+1; x < i + 5 && x < 15 && y < j + 5 && y < 15; x++, y++) {
        if (chessBoard[x][y] == role) {
            anoDirec++;
        } else if(chessBoard[x][y] != 0){
            anoBoard = true;
            break;
        } else {
            break;
        }
    }
    totalNum = oneDirec + anoDirec + 1;
    addTotalValue(totalNum);

    //反对角线
    var oneDirec = 0;
    var anoDirec = 0;
    var oneBoard = false;
    var anoBoard = false;
    for (var x = i+1, y=j-1; x < i + 5 && x < 15 && y > j - 5 && y >= 0; x++, y--) {
        if (chessBoard[x][y] == role) {
            oneDirec++;
        } else if(chessBoard[x][y] != 0){
            oneBoard = true;
            break;
        } else {
            break;
        }
    }
    for (var x = i-1, y=j+1; x > i - 5 && x >= 0 && y < j + 5 && y < 15; x--, y++) {
        if (chessBoard[x][y] == role) {
            anoDirec++;
        } else if(chessBoard[x][y] != 0){
            anoBoard = true;
            break;
        } else {
            break;
        }
    }
    totalNum = oneDirec + anoDirec + 1;
    addTotalValue(totalNum);

    return value;
};
//判断人或电脑是否赢棋
var judgeWin = function (role) {
    for(var i = 0; i < 15; i++) {
        for(var j = 0; j < 15; j++) {
            if(chessBoard[i][j] != role) {
                continue;
            }
            var oneDirec = 0;
            var anoDirec = 0;
            for (var x = i - 1; x > i - 5 && x >= 0; x--) {
                if (chessBoard[x][j] == role) {
                    oneDirec++;
                } else {
                    break;
                }
            }
            for (var x = i + 1; x < i + 5 && x < 15; x++) {
                if (chessBoard[x][j] == role) {
                    anoDirec++;
                } else {
                    break;
                }
            }
            var judge = function() {
                var totalNum = oneDirec + anoDirec + 1;
                if (totalNum == 5) {
                    if (role == people) {
                        alert("You Win!");
                        return true;
                    } else if (role == comp) {
                        alert("Computer Win");
                        return true;
                    }
                }
            };
            if(judge()) return true;

            //纵向
            var oneDirec = 0;
            var anoDirec = 0;
            for (var x = j - 1; x > j - 5 && x >= 0; x--) {
                if (chessBoard[i][x] == role) {
                    oneDirec++;
                } else {
                    break;
                }
            }
            for (var x = j + 1; x < j + 5 && x < 15; x++) {
                if (chessBoard[i][x] == role) {
                    anoDirec++;
                } else {
                    break;
                }
            }
            if(judge()) return true;

            //对角线
            var oneDirec = 0;
            var anoDirec = 0;
            for (var x = i-1, y=j-1; x > i - 5 && x >= 0 && y > j - 5 && y >= 0; x--, y--) {
                if (chessBoard[x][y] == role) {
                    oneDirec++;
                } else {
                    break;
                }
            }
            for (var x = i+1, y=j+1; x < i + 5 && x < 15 && y < j + 5 && y < 15; x++, y++) {
                if (chessBoard[x][y] == role) {
                    anoDirec++;
                } else {
                    break;
                }
            }
            if(judge()) return true;

            //反对角线
            var oneDirec = 0;
            var anoDirec = 0;
            for (var x = i+1, y=j-1; x < i + 5 && x < 15 && y > j - 5 && y >= 0; x++, y--) {
                if (chessBoard[x][y] == role) {
                    oneDirec++;
                } else {
                    break;
                }
            }
            for (var x = i-1, y=j+1; x > i - 5 && x >= 0 && y < j + 5 && y < 15; x--, y++) {
                if (chessBoard[x][y] == role) {
                    anoDirec++;
                } else {
                    break;
                }
            }
            if(judge()) return true;

        }
    }
};

context.strokeStyle = "#BFBFBF";
var logo = new Image();
logo.src = "images/logo.png";

logo.onload = function () {
    context.drawImage(logo, 0, 0, 450, 450);
    drawLines();
};

chess.onclick = function (e) {
    if(!over) {
        var x = (e.offsetX || e.pageX - $(e.target).offset().left);
        var y = (e.offsetY || e.pageY - $(e.target).offset().top);
        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);
        if (chessBoard[i][j] == 0) {
            onestep(i, j, me);
            if (judgeWin(people)) {
                over = true;
                return;
            }
            me = !me;
        }

        computerFall();
        if (judgeWin(comp)) {
            over = true;
            return;
        }
        me = !me;
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

var onestep = function (i, j, me) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13,
        15 + i * 30 + 2, 15 + j * 30 - 2, 3);
    if (me) {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
        chessBoard[i][j] = people; //people
    } else {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
        chessBoard[i][j] = comp; //computer
    }
    context.fillStyle = gradient;
    context.fill();

};

var beginGame_btn = document.getElementById("begin");

beginGame_btn.onclick = function (e) {
    window.location.reload();
};