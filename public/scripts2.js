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
var E = [
    [[0,1,0],[1,1,1],[0,0,0]],
    [[1,0,0],[1,1,0],[1,0,0]],
    [[1,1,1],[0,1,0],[0,0,0]],
    [[0,0,1],[0,1,1],[0,0,1]]
]
var Pieces = {
    0 : Z,
    1 : E,
    2 : L,
    3 : J
}

// Globals

var c = document.getElementById('tetris-board');
var ctx = c.getContext("2d");
var board = [];
var totalPieces = 4;
var gameInterval = window.setInterval(()=>{
    console.log("alert");
    obj.moveDown();
},1000);

// Build the board

function fillColor(i,j,color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(i*20, j*20, 20, 20);
    ctx.fill();
    ctx.stroke();
}
function build() {
    for(var i=0;i<20;i++) {
        var row = [];
        for(var j=0;j<10;j++) {
            fillColor(j,i,"#fff");
            row.push(0);
        }
        board.push(row);
    }
}


// Piece Object

function piece() {
    this.x = 4;
    this.y = 0;
    this.indP = 0;
    this.p = Pieces[this.indP];
    this.ind = 0;
    this.total = 4;
    this.newPiece = function () {
        this.indP = (this.indP+1)%totalPieces;
        this.x = 4;
        this.y = 0;
        this.ind = 0;
        this.p = Pieces[this.indP];
        if(!this.collision(0,0,this.p[this.ind])) {
            this.draw();
        }else {
            clearInterval(gameInterval);
            document.getElementById("game-display").innerHTML = "Game Over";
        }
    }
    this.lockPiece = function () {
        var currentP = this.p[this.ind];
        for(var i=0;i<currentP.length;i++) {
            for(var j=0;j<currentP.length;j++) {
                if(currentP[i][j]==1){
                    board[this.y+i][this.x+j]=1;
                }
            }
        }
    }
    this.draw = function () {
        var currentP = this.p[this.ind];
        for(var i=0;i<currentP.length;i++) {
            for(var j=0;j<currentP.length;j++) {
                if(currentP[i][j]==1){
                    fillColor(this.x+j,this.y+i,"blue");
                }
            }
        }
    }
    this.unDraw = function () {
        var currentP = this.p[this.ind];
        for(var i=0;i<currentP.length;i++) {
            for(var j=0;j<currentP.length;j++) {
                if(currentP[i][j]==1){
                    fillColor(this.x+j,this.y+i,"#fff");
                }
            }
        }
    }
    this.moveDown = function () {
        if(!this.collision(0,1,this.p[this.ind])) {
            this.unDraw();
            this.y++;
            this.draw();
        }else {
            this.lockPiece();
            this.newPiece();
        }
    }
    this.moveLeft = function () {
        if(!this.collision(-1,0,this.p[this.ind])) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }
    this.moveRight = function () {
        if(!this.collision(1,0,this.p[this.ind])) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }
    this.rotate = function () {
        if(!this.collision(0,0,this.p[(this.ind+1)%this.total])) {
            this.unDraw();
            this.ind = (this.ind+1)%this.total;
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
                if(board[nextY][nextX]==1) return true;
            }
        }
        return false;
    }

}


// Starting the game

build();
var obj = new piece(4,0,L);
obj.draw();



// Event Listeners
function rotate(){ obj.rotate(); }
function down() { obj.moveDown(); }
function right() { obj.moveRight(); }
function left() { obj.moveLeft(); }

