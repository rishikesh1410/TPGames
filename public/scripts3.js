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

var Pieces2 = {
    0 : [Z,"red"],
    1 : [T,"purple"],
    2 : [L,"blue"],
    3 : [J,"orange"],
    4 : [I,"cyan"],
    5 : [O,"yellow"],
    6 : [S,"green"]
}

// Globals

var c2 = document.getElementById('tetris-board2');
var ctx2 = c2.getContext("2d");
var x2,y2,nthPiece2,p2,pieceColor2,nthInd2,score2,gameOver2,lastScore2;
var level2,board2,totalPieces2,quantum2,gameInterval2;



// All Functions


// Build the board

var fillColor2 = function(i,j,color) {
    ctx2.beginPath();
    ctx2.fillStyle = color;
    ctx2.rect(i*20, j*20, 20, 20);
    ctx2.fill();
    ctx2.stroke();
}
var drawBoard2 = function() {
    for(var i=0;i<board2.length;i++) {
        for(var j=0;j<board2[0].length;j++) {
            fillColor2(j,i,board2[i][j]);
        }
    }
}
var build2 = function() {
    x2 = 4,y2 = 0;
    level2 = 0,nthPiece2 = 0,nthInd2 = 0,score2 = 0;
    p2 = Pieces2[nthPiece2][0],pieceColor2 = Pieces2[nthPiece2][1];
    gameOver2 = false,lastScore2 = 0;
    board2 = [];
    totalPieces2 = 7,quantum2 = 1100,gameInterval2;
    for(var i=0;i<20;i++) {
        var row = [];
        for(var j=0;j<9;j++) {
            row.push("#fff");
        }
        board2.push(row);
    }
    drawBoard2();
}

// Change Game Speed

var changeSpeed2 = function(){
    quantum2 -= 100;
    level2++;
    document.getElementById("game-over2").innerHTML = "<p>Level : "+ level2 +"</p>";
    clearInterval(gameInterval2);
    gameInterval2 = window.setInterval(()=>{
        moveDown2();
    },quantum2);
}

// Game Functions

var newPiece2 = function () {
    nthPiece2 = (nthPiece2+1)%totalPieces2;
    x2 = 4;
    y2 = 0;
    nthInd2 = 0;
    p2 = Pieces2[nthPiece2][0];
    if(!collision2(0,0,p2[nthInd2])) {
        draw2();
    }else {
        clearInterval(gameInterval2);
        clearLines2();
        gameOver2 = true;
        document.getElementById("game-over2").innerHTML += "<p>Game Over</p>";
    }
}
var lockPiece2 = function () {
    var currentP = p2[nthInd2];
    for(var i=0;i<currentP.length;i++) {
        for(var j=0;j<currentP.length;j++) {
            if(currentP[i][j]==1){
                board2[y2+i][x2+j]=Pieces2[nthPiece2][1];
            }
        }
    }
}
var draw2 = function () {
    var currentP = p2[nthInd2];
    for(var i=0;i<currentP.length;i++) {
        for(var j=0;j<currentP.length;j++) {
            if(currentP[i][j]==1){
                fillColor2(x2+j,y2+i,Pieces2[nthPiece2][1]);
            }
        }
    }
}
var unDraw2 = function () {
    var currentP = p2[nthInd2];
    for(var i=0;i<currentP.length;i++) {
        for(var j=0;j<currentP.length;j++) {
            if(currentP[i][j]==1){
                fillColor2(x2+j,y2+i,"#fff");
            }
        }
    }
}
var moveDown2 = function () {
    if(!collision2(0,1,p2[nthInd2])) {
        unDraw2();
        y2++;
        draw2();
    }else {
        console.log(gameOver2);
        if(!gameOver2) {
            console.log("calling");
            lockPiece2();
            newPiece2();
            clearLines2();
        }
    }
}
var moveLeft2 = function () {
    if(!gameOver2 && !collision2(-1,0,p2[nthInd2])) {
        unDraw2();
        x2--;
        draw2();
    }
}
var moveRight2 = function () {
    if(!gameOver2 && !collision2(1,0,p2[nthInd2])) {
        unDraw2();
        x2++;
        draw2();
    }
}
var rotate2 = function () {
    if(!gameOver2 && !collision2(0,0,p2[(nthInd2+1)%(p2.length)])) {
        unDraw2();
        nthInd2 = (nthInd2+1)%(p2.length);
        draw2();
    }
}
var collision2 = function (xx,yy,currentP) {
    for(var i=0;i<currentP.length;i++) {
        for(var j=0;j<currentP.length;j++) {
            var nextX = x2 + xx + j;
            var nextY = y2 + yy + i;
            if(currentP[i][j]==0) continue;
            if(nextX>=9 || nextX<0 || nextY>=20) return true;
            if(nextY<0) continue;
            if(board2[nextY][nextX]!="#fff") return true;
        }
    }
    return false;
}
var clearLines2 = function () {
    for(var i=0;i<board2.length;i++) {
        var isRowFull2 = true;
        for(var j=0;j<board2[0].length;j++) {
            if(board2[i][j]=="#fff") isRowFull2=false;
        }
        if(isRowFull2) {
            for(var k=i;k>=1;k--) {
                for(var l=0;l<board2[0].length;l++) board2[k][l]=board2[k-1][l];
            }
            for(var l=0;l<board2[0].length;l++) board2[0][l]="#fff";
            if(++score2>=lastScore2+5) {
                lastScore2=score2;
                changeSpeed2();
            }
        }
    }
    document.getElementById("game-display2").innerHTML = "<p> Score : "+ score2 + "</p>";
    drawBoard2();
}
var startGame2 = function() {
    build2();
    draw2();
    changeSpeed2();
    document.getElementById("game-display2").innerHTML = "<p> Score : "+ score2 + "</p>";
}
var liveGame2 = function () {
    document.getElementById("game-display2").innerHTML = "<p> Score : "+ score2 + "</p>";
    draw2();
    changeSpeed2();
}


// Starting the game
startGame2();

// Event Listeners
function rotate2(){ rotate2(); }
function down2() { moveDown2(); }
function right2() { moveRight2(); }
function left2() { moveLeft2(); }

