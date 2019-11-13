/*
游戏生成模块
genarateBoard: 初始化九宫格
getBoardArray: 生成二维board数组
solve: DFS求解数独
lasVegas: 拉斯维加斯随机算法生成数独
hideValue: 根据难度挖空，保证唯一解
setValue: 给每个input cell设置生成的board中的值，设置颜色和readOnly属性
*/
//board存放生成的棋盘，answer存放答案，都是二维数组
var board = [];
var answer = [];
//生成DOM，比在html文件里写很多内容要更方便，具体就是生成9x9的棋盘，每个单位的class="cell"
function generateBoard() {
    for (var i = 0; i < 9; i++) {
        var node = document.createElement("div");
        var attr = document.createAttribute("class");
        attr.value = "grid row";
        node.setAttributeNode(attr);
        document.getElementById("chess-board").appendChild(node);
        //增加4个变量并添加到cell
        for (var j = 0; j < 9; j++) {
            var input = document.createElement("input");
            var attrType = document.createAttribute("type");
            attrType.value = "text";
            var attrClass = document.createAttribute("class");
            attrClass.value = "cell";
            var attrMax = document.createAttribute("maxlength");
            attrMax.value = "1";
            var attrChange = document.createAttribute("onchange");
            attrChange.value = "listenInput()";
            input.setAttributeNode(attrType);
            input.setAttributeNode(attrClass);
            input.setAttributeNode(attrMax);
            input.setAttributeNode(attrChange);

            node.appendChild(input);
        }
    }
}

//生成二维board数组
function getBoardArray() {
    var grid_rows = [].slice.call(document.querySelectorAll(".row"));
    grid_rows.forEach(function (row, index) {
        var nums;
        board.push([]);
        row_cells = [].slice.call(row.children);
        row_cells.forEach(function (num) {
            board[index].push(num.value);
        });
    })
    return board;
};

//随机生成第一行
function generateSudoku(board) {
    for (var i = 0; i < 9; i++) {
        var number = getRandomNum();
        while (board[0].includes(number)) {
            number = getRandomNum();
        }
        board[0][i] = number;
    }
    return board;
}

function getRandomNum() {
    var number = Math.floor(Math.random() * 9) + 1;
    return number;
}

//递归，深度优先搜索求解board，被lasVegas()调用
function solve(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] == "") {
                for (var c = 1; c <= 9; c++) {
                    if (isValid(board, i, j, c)) {
                        board[i][j] = c;

                        if (solve(board))
                            return true;
                        else
                            board[i][j] = "";
                    }
                }
                return false;
            }
        }
    }
    return true;
}
//拉斯维加斯随机算法，先随机填充n个数（一般取11），然后调用solve求解其他空。不断调用lasVegas直到有正确解
function lasVegas(n) {
    var i, j;
    for (i = 0; i < 9; i++)
        for (j = 0; j < 9; j++)
            board[i][j] = 0;
    while (n) {
        i = getRandomNum() - 1;
        j = getRandomNum() - 1;
        value = getRandomNum();
        if (board[i][j] == 0)
            if (isValid(board, i, j, value)) {
                board[i][j] = value;
                n--;
            }
    }
    if (solve(board)) return true;
    else return false;
}

//根据难度挖不同数量的空，每次挖空调用checkUnique()判断是否唯一，保证了解的唯一性
function hideValue(board, diffMode) {
    var deleteNumber = 0;
    switch (diffMode) {
        case 0:
            deleteNumber = 81 - (Math.floor(Math.random() * 15) + 45);
            break;
        case 1:
            deleteNumber = 81 - (Math.floor(Math.random() * 5) + 37);
            break;
        case 2:
            deleteNumber = 81 - (Math.floor(Math.random() * 5) + 33);
            break;
        case 3:
            deleteNumber = 81 - (Math.floor(Math.random() * 5) + 28);
            break;
    }
    var has = [];
    for (var i = 0; i < deleteNumber; i++) {
        var x = Math.floor(Math.random() * 9);
        var y = Math.floor(Math.random() * 9);
        var check = "" + x + y;
        //假如check(代表坐标)已经挖过，那么重新选择空，保证挖到deleteNumber个空
        if (!has.includes(check)) {
            has.push(check);
            board[x][y] = "";
        } else {
            i -= 1;
            continue;
        }
    }
}
//要挖(i,j)时，循环判断1-9除了c的其他数填充到这里的话，solve()是否还会求出board的一种解
//若所有值调用solve()返回true说明这个空挖掉的话解不唯一，应保留
function checkUnique(i, j, c) {
    var tmpBoard = [];
    for (var i = 0; i < 9; i++) {
        tmpBoard[i] = [];
        Object.assign(tmpBoard[i], board[i]);
    }
    for (var t = 1; t <= 9; t++) {
        if (t != c && isValid(tmpBoard, i, j, c)) {
            tmpBoard[i][j] = t;
            if (solve(tmpBoard))
                return false;
            tmpBoard[i][j] = "";
        }
    }
    return true;
}

//根据board设置cell，并把给出值的设置为readOnly
function setValue(board) {
    var ele = document.getElementsByClassName("cell");
    var count = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            ele[count].readOnly = false;
            var attr = document.createAttribute("value");
            if (board[i][j] == "") {
                attr.value = "";
                ele[count].setAttributeNode(attr);
                count += 1;
                continue;
            }
            attr.value = board[i][j];
            ele[count].setAttributeNode(attr);
            ele[count].readOnly = true;
            count += 1;
        }
    }
}
//startNew()函数调用
function setValue2(board) {
    var ele = document.getElementsByClassName("cell");
    var count = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            ele[count].readOnly = false;
            if (board[i][j] == "") {
                ele[count].value = "";
                count += 1;
                continue;
            }
            ele[count].value = board[i][j];
            ele[count].readOnly = true;
            count += 1;
        }
    }
}