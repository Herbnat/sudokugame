var board = [];
var answer = [];
//新游戏 按钮
function startNew(){
  var a = window.confirm("Sure to start a new game?\n \nYour work will be clear!");
  if(a){
    for(var i = 0; i < 9; i++){
      for(var j = 0; j < 9; j++)
        board[i][j] = "";
    }
    var ele = document.getElementsByClassName("cell");
    for(var i = 0; i < ele.length; i++){
      ele[i].value = "";
      ele[i].style.color = "black";
    }
    var mySelect = document.getElementById("diff_form");
    var diffMode = mySelect.options.selectedIndex;
    
    firstRow();
    solve(board);
    //document.getElementById("demo2").innerHTML=board;

    for(var i = 0; i < 9; i++){
      answer[i] = [];
      Object.assign(answer[i], board[i]);
    }
    digHole(board, diffMode);
    //document.getElementById("demo3").innerHTML=board;
    Reset();
    start();
    setValue2(board);
  }
  else{
    return;
  }

}
//答案 按钮
function getAnswer(){
  var a = window.confirm("You want to give up?");
  if(a){
    var ele = document.getElementsByClassName("cell");
    var count = 0;
    for(var i = 0; i < 9; i++){
      for(var j = 0; j < 9; j++){
        if(ele[count].readOnly == false){
          ele[count].value = answer[i][j];
          ele[count].style.color = "blue";
        }
        count++;
      }
    }
  }
  else{
    return;
  }
}

function initializePage(){
  generateBoard();
  initialBoard();
  var ele=document.getElementsByClassName("cell");
  var k=0;
  for(var i=0;i<9;i++){
    for(var j=0;j<9;j++){
      //坐标属性
      var nameAttr=document.createAttribute("name");
      nameAttr.value=""+i+j;
      ele[k].setAttributeNode(nameAttr);
      i++;
    }
  }
}


function init(){
  firstRow();
  solve(board);
  for(var i=0;i<9;i++){
    answer[i]=[];
    Object.assign(answer[i],board[i]);
  }
  digHole(board,1);
  setValue(board);
  start();
  listenInput(board);
  console.log(board);
}
//生成DOM，比在html文件里写很多内容要更方便，具体就是生成9x9的棋盘，每个单位的class="cell"
function generateBoard(){
  for(var i=0;i<9;i++){
    var divNode=document.createElement("div");
    var attr=document.createAttribute("class");
    attr.value="grid row";
    divNode.setAttributeNode(attr);
    document.getElementById("chess-board").appendChild(divNode);
    for(var j=0;j<9;j++){
      var cell=document.createElement("input");
      var attr1=document.createAttribute("type");
      attr1.value="text";
      var attr2=document.createAttribute("onchange");
      attr2.value="listenInput()";
      var attr3=document.createAttribute("maxlength");
      attr3.value="1";
      var attr4=document.createAttribute("class");
      attr4.value="cell";
      cell.setAttributeNode(attr1);
      cell.setAttributeNode(attr2);
      cell.setAttributeNode(attr3);
      cell.setAttributeNode(attr4);
      divNode.appendChild(cell);
    }
  }
}

//

function initialBoard(){
  var rows=[].slice.call(document.querySelectorAll(".row"));
  rows.forEach(function(row,i){
    var nums;
    board.push([]);
    cells=[].slice.call(row.children);
    cells.forEach(function(num){
      board[i].push(num.value);
    })
  })
}

//生成第一行

function firstRow(){
  for(var i=0;i<9;i++){
    var n=getRandom();
    while(board[0].includes(n)){
      n=getRandom();
    }
    board[0][i]=n;
  }
}

function getRandom(){
  var a=Math.floor(Math.random()*9)+1;
  return a;
}

//递归，根据第一行生成总的board
function solve(board){
  for(var i=0;i<board.length;i++){
    for(var j=0;j<board[0].length;j++){
      if(board[i][j]==""){
        for(var c=1;c<=9;c++){
          if(isValid(board,i,j,c)){
            board[i][j]=c;   
            if(solve(board))
              return true; 
            else
              board[i][j]=""; 
          }
        }
        return false;
      }
    }
  }
  return true;
}
//检查如果(row,col)放入c，是否符合规则
function isValid(board,row,col,c){
        if(board[row][col]==c) return true;
        for(var i=0;i<9;i++) {
            if(board[i][col]!="" && board[i][col]==c) return false; //check row
            if(board[row][i]!="" && board[row][i]==c) return false; //check column
            if(board[3*Math.floor(row/3)+Math.floor(i/3)][3*Math.floor(col/3)+Math.floor(i%3)]!="" && 
board[3*Math.floor(row/3)+Math.floor(i/3)][3*Math.floor(col/3)+Math.floor(i%3)]==c) return false; //check 3*3 block
        }
        return true;
}

//根据难度挖不同数量的空
function digHole(board,diffMode){
  var deleteNumber=0;
  switch(diffMode){
    case 0:
      deleteNumber=81-(Math.floor(Math.random()*15)+45);
      break;
    case 1:
      deleteNumber=81-(Math.floor(Math.random()*5)+35);
      break;
    case 2:
      deleteNumber=81-(Math.floor(Math.random()*5)+30);
      break;
    case 3:
      deleteNumber=81-(Math.floor(Math.random()*5)+25);
      break;
  }
  var has=[];
  for (var i=0;i<deleteNumber;i++){
    var x=Math.floor(Math.random()*9); 
    var y=Math.floor(Math.random()*9);
    var check=""+x+y;
    if (!has.includes(check)){
      has.push(check);
      board[x][y]="";
    } else{
      i-=1;
      continue;
    }
  }
}

//根据board设置cell，并把给出值的设置为readOnly
function setValue(board){
  var ele=document.getElementsByClassName("cell");
  var count=0;
  for (var i=0;i<9;i++){
    for (var j=0;j<9;j++){
      ele[count].readOnly=false;
      var attr=document.createAttribute("value");
      if (board[i][j]==""){
        attr.value="";
        ele[count].setAttributeNode(attr);
        count+=1;
        continue;
      }
      attr.value=board[i][j];
      ele[count].setAttributeNode(attr);
      ele[count].readOnly=true;
      count+=1;
    }
  }
}
function setValue2(board){
  var ele=document.getElementsByClassName("cell");
  var count=0;
  for (var i=0;i<9;i++){
    for (var j=0; j<9;j++){
      ele[count].readOnly=false;
      if (board[i][j]==""){
        ele[count].value="";
        count+=1;
        continue;
      }
      ele[count].value=board[i][j];
      ele[count].readOnly=true;
      count+=1;
    }
  }
}

//等待输入
function listenInput(board){
  $(document).ready(function(){
    $('.cell').each(function() {
      var elem=$(this);
      //添加change事件
      elem.on("change input", function(event){
        var index=elem[0].getAttribute("name");
        var number=elem[0].value; 
        var x=index.charAt(0);
        var y=index.charAt(1);
        if (isNaN(number)){ 
          elem[0].style.color = "red";
        } else if(number==0){
          elem[0].style.color="red";
        } else if(!isValid(board, x, y, number)){ //输入不符合要求也要标红
          elem[0].style.color="red";
        } else{
          elem[0].style.color="blue";
          var attr=document.createAttribute("value");
          attr.value=number;
          elem[0].setAttributeNode(attr);
          board[x][y]=parseInt(number);
          return;
        }
      });
    });
  });
}

function checkResult(){
  for (var i=0;i<9;i++){
    for (var j=0;j<9;j++){
      var check=allCellRight(board,i,j,board[i][j]);
      if (check==false){
        alert("Answer Wrong!");
        return;
      }
    }
  }
  alert("~Congratulations~")
}
//重置board和cell
function reset(){
  var ele=document.getElementsByClassName("cell");
  for (var i=0; i<ele.length;i++){
    if (ele[i].readOnly==false){
      ele[i].value = ""; 
      var index=ele[i].getAttribute("name");      
      var x=index.charAt(0);
      var y=index.charAt(1);
      board[x][y]="";
    } 
  }
}
function allCellRight(board,row,col,c){
  for(var i=0;i<9;i++) {
      if(board[row][col]=="") return false;
      if(board[i][col]!="" && board[i][col]==c && i!=row) return false; //check row
      if(board[row][i]!="" && board[row][i]==c && i!=col) return false; //check column
      if(board[3*Math.floor(row/3) + Math.floor(i/3)][3*Math.floor(col/3)+Math.floor(i%3)]!="" && 
board[3*Math.floor(row/3)+Math.floor(i/3)][3*Math.floor(col/3)+Math.floor(i%3)]==c && 
((3*Math.floor(row/3)+Math.floor(i/3))!=row && (3*Math.floor(col/3)+Math.floor(i%3))!=col)) return false; //check 3*3 block
  }
  return true;
}

var minute,second;//分 秒
minute=second=0;//初始化
var STOP=0;

var int;
function Reset()//重置
{
  window.clearInterval(int);
  minute=second=0;
  document.getElementById('timetext').innerHTML='00:00:00';
}

function start()//开始
{
  int=setInterval(timer,1000);
}

function stop(){
  if(STOP==0){
    clearInterval(int);
    STOP=1;
  }else{
    int=setInterval(timer,1000);
    STOP=0;
  }
}

//计时
function timer(){
    second++;
  if(second>=60){
    second=0;
    minute=minute+1;
  }

  if(minute>=60){
    alert("Too much time!");
    Reset();
    start();
  }
  document.getElementById('timetext').innerHTML=printf(minute)+':'+printf(second);

}

function printf(t){
  var s=""+t;
  if(s.length==1){
    return "0"+s;
  }else{
    return s;
  }
}
