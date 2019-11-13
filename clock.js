/*
计时模块
*/
var minute, second; //分 秒
minute = second = 0; //初始化
var STOP = 0;

var int;

function Reset() //重置
{
    window.clearInterval(int);
    minute = second = 0;
    document.getElementById('timetext').innerHTML = '00:00';
}

function start() //开始
{
    int = setInterval(timer, 1000);
}
//暂停秒表，attention:变量answering和STOP
function stop() {
    if (answering) {
        alert("Your are viewing answer, CAN'T PAUSE");
        return;
    }
    if (STOP == 0) {
        clearInterval(int);
        STOP = 1;
    } else {
        int = setInterval(timer, 1000);
        STOP = 0;
    }
}

//计时
function timer() {
    second++;
    //60秒后清0
    if (second >= 60) {
        second = 0;
        minute = minute + 1;
    }

    if (minute >= 60) {
        alert("Too much time!");
        Reset();
        start();
    }
    document.getElementById('timetext').innerHTML = printf(minute) + ':' + printf(second);

}
//字符串转换函数
function printf(t) {
    var s = "" + t;
    if (s.length == 1) {
        return "0" + s;
    } else {
        return s;
    }
}