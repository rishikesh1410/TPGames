//  Tetris

// Pieces
var Z = [
    [[1,1,0],[0,1,1],[0,0,0]],
    [[0,1,0],[1,1,0],[1,0,0]],
    [[0,1,1],[1,1,0],[0,0,0]],
    [[0,1,0],[0,1,1],[0,0,1]]
];
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
    [[0,0,1],[0,1,1],[0,0,1]]
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
    5 : [O,"yellow"]
}

// Globals

var c = document.getElementById('tetris-board');
var ctx = c.getContext("2d");
var board = [];
var totalPieces = 6;
var quantum = 1000;
var gameInterval = window.setInterval(()=>{
    console.log("alert");
    obj.moveDown();
    if(obj.score>=5) quantum=quantum/2;
},quantum);


// Build the board

function fillColor(i,j,color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(i*20, j*20, 20, 20);
    ctx.fill();
    ctx.stroke();
}
function drawBoard() {
    for(var i=0;i<board.length;i++) {
        for(var j=0;j<board[0].length;j++) {
            fillColor(j,i,board[i][j]);
        }
    }
}
function build() {
    for(var i=0;i<20;i++) {
        var row = [];
        for(var j=0;j<10;j++) {
            row.push("#fff");
        }
        board.push(row);
    }
    drawBoard();
}


// Piece Object

function Game() {
    this.x = 4;
    this.y = 0;
    this.nthPiece = 0;
    this.p = Pieces[this.nthPiece][0];
    this.nthInd = 0;
    this.score = 0;
    this.gameOver = false;
    this.newPiece = function () {
        this.nthPiece = (this.nthPiece+1)%totalPieces;
        this.x = 4;
        this.y = 0;
        this.nthInd = 0;
        this.p = Pieces[this.nthPiece][0];
        if(!this.collision(0,0,this.p[this.nthInd])) {
            this.draw();
        }else {
            clearInterval(gameInterval);
            this.clearLines();
            this.gameOver = true;
            document.getElementById("game-over").innerHTML = "<p>Game Over</p>";
        }
    }
    this.lockPiece = function () {
        var currentP = this.p[this.nthInd];
        for(var i=0;i<currentP.length;i++) {
            for(var j=0;j<currentP.length;j++) {
                if(currentP[i][j]==1){
                    board[this.y+i][this.x+j]=Pieces[this.nthPiece][1];
                }
            }
        }
    }
    this.draw = function () {
        var currentP = this.p[this.nthInd];
        for(var i=0;i<currentP.length;i++) {
            for(var j=0;j<currentP.length;j++) {
                if(currentP[i][j]==1){
                    fillColor(this.x+j,this.y+i,Pieces[this.nthPiece][1]);
                }
            }
        }
    }
    this.unDraw = function () {
        var currentP = this.p[this.nthInd];
        for(var i=0;i<currentP.length;i++) {
            for(var j=0;j<currentP.length;j++) {
                if(currentP[i][j]==1){
                    fillColor(this.x+j,this.y+i,"#fff");
                }
            }
        }
    }
    this.moveDown = function () {
        if(!this.collision(0,1,this.p[this.nthInd])) {
            this.unDraw();
            this.y++;
            this.draw();
        }else {
            if(!this.gameOver) {
                this.lockPiece();
                this.newPiece();
                this.clearLines();
            }
        }
    }
    this.moveLeft = function () {
        if(!this.gameOver && !this.collision(-1,0,this.p[this.nthInd])) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }
    this.moveRight = function () {
        if(!this.gameOver && !this.collision(1,0,this.p[this.nthInd])) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }
    this.rotate = function () {
        if(!this.gameOver && !this.collision(0,0,this.p[(this.nthInd+1)%(this.p.length)])) {
            this.unDraw();
            this.nthInd = (this.nthInd+1)%(this.p.length);
            this.draw();
        }
    }
    this.collision = function (x,y,currentP) {
        for(var i=0;i<currentP.length;i++) {
            for(var j=0;j<currentP.length;j++) {
                var nextX = this.x + x + j;
                var nextY = this.y + y + i;
                if(currentP[i][j]==0) continue;
                if(nextX>=10 || nextX<0 || nextY>=20) return true;
                if(nextY<0) continue;
                if(board[nextY][nextX]!="#fff") return true;
            }
        }
        return false;
    }
    this.clearLines = function () {
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
                this.score++;
            }
        }
        document.getElementById("game-display").innerHTML = "<p> Score : "+ this.score + "</p>";
        drawBoard();
    }

}


// Starting the game

build();
var obj = new Game();
obj.draw();
document.getElementById("game-display").innerHTML = "<p> Score : "+ obj.score + "</p>";




// Event Listeners
function rotate(){ obj.rotate(); }
function down() { obj.moveDown(); }
function right() { obj.moveRight(); }
function left() { obj.moveLeft(); }

