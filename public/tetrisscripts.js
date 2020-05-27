//  Tetris

// Pieces
var Z = [
    [[1,1,0],[0,1,1],[0,0,0]],
    [[0,1,0],[1,1,0],[1,0,0]]
]
var S = [
    [[0,1,1],[1,1,0],[0,0,0]],
    [[1,0,0],[1,1,0],[0,1,0]]
]
var J = [
    [[1,0,0],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,0],[1,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],
    [[1,1,0],[1,0,0],[1,0,0]]
]
var L = [
    [[1,0,0],[1,0,0],[1,1,0]],
    [[0,0,1],[1,1,1],[0,0,0]],
    [[1,1,0],[0,1,0],[0,1,0]],
    [[1,1,1],[1,0,0],[0,0,0]]
]
var T = [
    [[0,1,0],[1,1,1],[0,0,0]],
    [[1,0,0],[1,1,0],[1,0,0]],
    [[1,1,1],[0,1,0],[0,0,0]],
    [[0,1,0],[1,1,0],[0,1,0]]
]
var I = [
    [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]],
    [[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
]
var O = [
    [[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]
]

var Pieces = {
    0 : [Z,"red"],
    1 : [T,"purple"],
    2 : [L,"blue"],
    3 : [J,"orange"],
    4 : [I,"cyan"],
    5 : [O,"yellow"],
    6 : [S,"green"]
}

// Globals

var c = document.getElementById('tetris-board');
var ctx = c.getContext("2d");
var x,y,nthPiece,p,pieceColor,nthInd,score,gameOver,lastScore;
var level,board,totalPieces,quantum,gameInterval;



// All Functions


// Build the board

var fillColor = function(i,j,color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(i*20, j*20, 20, 20);
    ctx.fill();
    ctx.stroke();
}
var drawBoard = function() {
    for(var i=0;i<board.length;i++) {
        for(var j=0;j<board[0].length;j++) {
            fillColor(j,i,board[i][j]);
        }
    }
}
var build = function() {
    x = 4,y = 0;
    level = 0,nthPiece = 0,nthInd = 0,score = 0;
    p = Pieces[nthPiece][0],pieceColor = Pieces[nthPiece][1];
    gameOver = false,lastScore = 0;
    board = [];
    totalPieces = 7,quantum = 1100,gameInterval;
    for(var i=0;i<20;i++) {
        var row = [];
        for(var j=0;j<10;j++) {
            row.push("#fff");
        }
        board.push(row);
    }
    drawBoard();
}

// Change Game Speed

var changeSpeed = function(){
    quantum -= 100;
    level++;
    document.getElementById("game-over").innerHTML = "<p>Level : "+ level +"</p>";
    clearInterval(gameInterval);
    gameInterval = window.setInterval(()=>{
        moveDown();
    },quantum);
}

// Game Functions

var newPiece = function () {
    nthPiece = (nthPiece+1)%totalPieces;
    x = 4;
    y = 0;
    nthInd = 0;
    p = Pieces[nthPiece][0];
    if(!collision(0,0,p[nthInd])) {
        draw();
    }else {
        clearInterval(gameInterval);
        clearLines();
        gameOver = true;
        document.getElementById("game-over").innerHTML += "<p>Game Over</p>";
    }
}
var lockPiece = function () {
    var currentP = p[nthInd];
    for(var i=0;i<currentP.length;i++) {
        for(var j=0;j<currentP.length;j++) {
            if(currentP[i][j]==1){
                board[y+i][x+j]=Pieces[nthPiece][1];
            }
        }
    }
}
var draw = function () {
    var currentP = p[nthInd];
    for(var i=0;i<currentP.length;i++) {
        for(var j=0;j<currentP.length;j++) {
            if(currentP[i][j]==1){
                fillColor(x+j,y+i,Pieces[nthPiece][1]);
            }
        }
    }
}
var unDraw = function () {
    var currentP = p[nthInd];
    for(var i=0;i<currentP.length;i++) {
        for(var j=0;j<currentP.length;j++) {
            if(currentP[i][j]==1){
                fillColor(x+j,y+i,"#fff");
            }
        }
    }
}
var moveDown = function () {
    if(!collision(0,1,p[nthInd])) {
        unDraw();
        y++;
        draw();
    }else {
        if(!gameOver) {
            lockPiece();
            newPiece();
            clearLines();
        }
    }
}
var moveLeft = function () {
    if(!gameOver && !collision(-1,0,p[nthInd])) {
        unDraw();
        x--;
        draw();
    }
}
var moveRight = function () {
    if(!gameOver && !collision(1,0,p[nthInd])) {
        unDraw();
        x++;
        draw();
    }
}
var rotate = function () {
    if(!gameOver && !collision(0,0,p[(nthInd+1)%(p.length)])) {
        unDraw();
        nthInd = (nthInd+1)%(p.length);
        draw();
    }
}
var collision = function (xx,yy,currentP) {
    for(var i=0;i<currentP.length;i++) {
        for(var j=0;j<currentP.length;j++) {
            var nextX = x + xx + j;
            var nextY = y + yy + i;
            if(currentP[i][j]==0) continue;
            if(nextX>=10 || nextX<0 || nextY>=20) return true;
            if(nextY<0) continue;
            if(board[nextY][nextX]!="#fff") return true;
        }
    }
    return false;
}
var clearLines = function () {
    for(var i=0;i<board.length;i++) {
        var isRowFull = true;
        for(var j=0;j<board[0].length;j++) {
            if(board[i][j]=="#fff") isRowFull=false;
        }
        if(isRowFull) {
            for(var k=i;k>=1;k--) {
                for(var l=0;l<board[0].length;l++) board[k][l]=board[k-1][l];
            }
            for(var l=0;l<board[0].length;l++) board[0][l]="#fff";
            if(++score>=lastScore+5) {
                lastScore=score;
                changeSpeed();
            }
        }
    }
    document.getElementById("game-display").innerHTML = "<p> Score : "+ score + "</p>";
    drawBoard();
}
var startGame = function() {
    build();
    draw();
    changeSpeed();
    document.getElementById("game-display").innerHTML = "<p> Score : "+ score + "</p>";
}
var liveGame = function () {
    document.getElementById("game-display").innerHTML = "<p> Score : "+ score + "</p>";
    draw();
    changeSpeed();
}


// Starting the game
startGame();

// Event Listeners
function rotate(){ rotate(); }
function down() { moveDown(); }
function right() { moveRight(); }
function left() { moveLeft(); }

