/*
判断模块
根据数独规则判断正确性，返回bool值
*/
//检查如果(row,col)放入c，是否符合规则
function isValid(board, row, col, c) {
    if (board[row][col] == c) return true;
    for (var i = 0; i < 9; i++) {
        if (board[i][col] != "" && board[i][col] == c) return false; //check row
        if (board[row][i] != "" && board[row][i] == c) return false; //check column
        if (board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + Math.floor(i % 3)] != "" &&
            board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + Math.floor(i % 3)] == c) return false; //check 3*3 block
    }
    return true;
}
//检查最终结果
function checkResult() {
    //假如已经查看答案，这个按钮不能按(后期变灰)
    if (answering) {
        alert("You are viewing answer!");
        return;
    }
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var check = isFinished(board, i, j, board[i][j]);
            if (check == false) {
                alert("Not complete!");
                return;
            }
        }
    }
    alert("~Congratulations~")
}

function isFinished(board, row, col, c) {
    for (var i = 0; i < 9; i++) {
        if (board[row][col] == "") return false;
        if (board[i][col] != "" && board[i][col] == c && i != row) return false; //check row
        if (board[row][i] != "" && board[row][i] == c && i != col) return false; //check column
        if (board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + Math.floor(i % 3)] != "" &&
            board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + Math.floor(i % 3)] == c &&
            ((3 * Math.floor(row / 3) + Math.floor(i / 3)) != row && (3 * Math.floor(col / 3) + Math.floor(i % 3)) != col)) return false; //check 3*3 block
    }
    return true;
}