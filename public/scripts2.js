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


// Build the board




// Piece Object

function Game() {
    this.x = 4;
    this.y = 0;
    this.nthPiece = 0;
    this.p = Pieces[this.nthPiece][0];
    this.nthInd = 0;
    this.score = 0;
    this.gameOver = false;
    this.lastScore = 0;
    this.level = 0;
    this.board = [];
    this.totalPieces = 6;
    this.quantum = 1000;
    this.gameInterval;
    this.fillColor = function(i,j,color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(i*20, j*20, 20, 20);
        ctx.fill();
        ctx.stroke();
    }
    this.drawBoard = function() {
        for(var i=0;i<this.board.length;i++) {
            for(var j=0;j<this.board[0].length;j++) {
                this.fillColor(j,i,this.board[i][j]);
            }
        }
    }
    this.build = function() {
        for(var i=0;i<20;i++) {
            var row = [];
            for(var j=0;j<10;j++) {
                row.push("#fff");
            }
            this.board.push(row);
        }
        this.drawBoard();
    }
    this.changeSpeed = function(){
        this.quantum -= 100;
        this.level++;
        document.getElementById("game-over").innerHTML = "<p>Level : "+ this.level +"</p>";
        clearInterval(this.gameInterval);
        this.gameInterval = window.setInterval(()=>{
            this.moveDown();
        },this.quantum);
    }
    this.newPiece = function () {
        this.nthPiece = (this.nthPiece+1)%this.totalPieces;
        this.x = 4;
        this.y = 0;
        this.nthInd = 0;
        this.p = Pieces[this.nthPiece][0];
        if(!this.collision(0,0,this.p[this.nthInd])) {
            this.draw();
        }else {
            clearInterval(this.gameInterval);
            this.clearLines();
            this.gameOver = true;
            document.getElementById("game-over").innerHTML += "<p>Game Over</p>";
        }
    }
    this.lockPiece = function () {
        var currentP = this.p[this.nthInd];
        for(var i=0;i<currentP.length;i++) {
            for(var j=0;j<currentP.length;j++) {
                if(currentP[i][j]==1){
                    this.board[this.y+i][this.x+j]=Pieces[this.nthPiece][1];
                }
            }
        }
    }
    this.draw = function () {
        var currentP = this.p[this.nthInd];
        for(var i=0;i<currentP.length;i++) {
            for(var j=0;j<currentP.length;j++) {
                if(currentP[i][j]==1){
                    this.fillColor(this.x+j,this.y+i,Pieces[this.nthPiece][1]);
                }
            }
        }
    }
    this.unDraw = function () {
        var currentP = this.p[this.nthInd];
        for(var i=0;i<currentP.length;i++) {
            for(var j=0;j<currentP.length;j++) {
                if(currentP[i][j]==1){
                    this.fillColor(this.x+j,this.y+i,"#fff");
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
                if(this.board[nextY][nextX]!="#fff") return true;
            }
        }
        return false;
    }
    this.clearLines = function () {
        for(var i=0;i<this.board.length;i++) {
            var isRowFull = true;
            for(var j=0;j<this.board[0].length;j++) {
                if(this.board[i][j]=="#fff") isRowFull=false;
            }
            if(isRowFull) {
                for(var k=i;k>=1;k--) {
                    for(var l=0;l<this.board[0].length;l++) this.board[k][l]=this.board[k-1][l];
                }
                for(var l=0;l<this.board[0].length;l++) this.board[0][l]="#fff";
                if(++this.score>=this.lastScore+5) this.changeSpeed();
            }
        }
        document.getElementById("game-display").innerHTML = "<p> Score : "+ this.score + "</p>";
        this.drawBoard();
    }
    this.startGame = function() {
        document.getElementById("game-display").innerHTML = "<p> Score : "+ obj.score + "</p>";
        this.build();
        this.draw();
        this.changeSpeed();
    }
    this.liveGame = function () {
        document.getElementById("game-display").innerHTML = "<p> Score : "+ obj.score + "</p>";
        this.draw();
        this.changeSpeed();
    }

}


// Starting the game
var obj = new Game();
obj.startGame();

// Event Listeners
function rotate(){ obj.rotate(); }
function down() { obj.moveDown(); }
function right() { obj.moveRight(); }
function left() { obj.moveLeft(); }

