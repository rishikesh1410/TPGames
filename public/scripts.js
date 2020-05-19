// Tic Tac Toe
var socket = io.connect('http://localhost:1234');
var players = ["Panda", "Rishi"];
var scores = [0,0]; // Will Change
var markers = ["O", "X"];
var winvalues = [7,56,448,73,146,292,273,84];
var turn = 0; // Will Change
var gameover = false; // Will Change
document.getElementById("game-display").innerHTML = players[turn] + "'s Turn";

function wincheck() {
    winvalues.forEach(ele => {
        if((ele&scores[turn]) == ele) {
            gameover=true;
            //document.getElementById("game-display").innerHTML = "";
            document.getElementById("game-display").innerHTML = players[turn] + " Wins!!";
        }
    });
    if(!gameover && (scores[0]+scores[1])==511) {
        gameover=true;
        document.getElementById("game-display").innerHTML = "Game Draw";
    }else if(!gameover) toggleturn();
}
function playHelper(clickedDiv,val) {
    if(!gameover){
        clickedDiv.onclick="";
        clickedDiv.innerHTML = markers[turn];
        scores[turn] += val;
        wincheck();
    }
    console.log(scores[0] + " " + scores[1]);
}
function play(clickedDiv,val) {
    send(val);
}
function toggleturn() {
    turn=1-turn;
    document.getElementById("game-display").innerHTML = players[turn] + "'s Turn";
}

function send(val) {
  console.log("sending..");
    socket.emit('play', {
        val : val,
        turn : turn,
        scores : scores,
        gameover : gameover
    });
}

function restart() {
    console.log("Restarting the game..");
    socket.emit('restart', {});
}
socket.on('play', (data) => {
    scores[0]=data.scores[0];
    scores[1]=data.scores[1];
    turn=data.turn;
    gameover=data.gameover;
    var clickedDiv = document.getElementById(data.val);
    playHelper(clickedDiv,data.val);
});

socket.on('restart',(data)=>{
    window.location="/";
});



