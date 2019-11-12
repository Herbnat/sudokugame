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
    grid_rows.forEach(function(row, index) {
        var nums;
        board.push([]);
        row_cells = [].slice.call(row.children);
        row_cells.forEach(function(num) {
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

//递归，根据第一行生成总的board
//剪枝
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
//根据难度挖不同数量的空
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