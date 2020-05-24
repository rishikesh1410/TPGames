var canvas = document.getElementById("pingpong-board");
var ctx = canvas.getContext("2d");
//var socket = io.connect('https://mygames01.herokuapp.com');
var round = 0;
var lastRound = 0;
var p1 = {
    x : 0,
    y : (canvas.height)/2 - 35,
    width : 10,
    height : 70,
    color : "#fff",
    score : 0
}
var p2 = {
    x : (canvas.width - 10),
    y : (canvas.height)/2 - 35,
    width : 10,
    height : 70,
    color : "#fff",
    score : 0
}

var ball = {
    x : (canvas.width)/2,
    y : (canvas.height)/2,
    r : 10,
    color : "#fff",
    speed : 2,
    velocityX : 2,
    velocityY : 2
}

var net = {
    x : (canvas.width)/2 - 1,
    y : 0,
    width : 2,
    height : 20,
    color : "#fff"
}



function drawBoard(x,y,w,h,color) {
    
    ctx.fillStyle=color;
    ctx.fillRect(x,y,w,h);
}
function drawRect(x,y,w,h,color) {
    ctx.fillStyle=color;
    ctx.fillRect(x,y,w,h);
}
function drawCircle(x,y,r,color) {
    
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI,true);
    ctx.fill();
}
function drawNet(x,y,w,h,color) {
    for(var i=0;i<canvas.height;i=(i+h+10)) {
        drawRect(x,i,w,h,color);
    }
}
function drawText(text,x,y) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(text,x,y);
}

function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    if((ball.y+ball.r) > canvas.height || (ball.y-ball.r) < 0) {
        ball.velocityY = -ball.velocityY;
    }
}

function render() {
    drawBoard(0,0,600,400,"black");
    drawNet(net.x,net.y,net.width,net.height,net.color);
    drawRect(p1.x,p1.y,p1.width,p1.height,p1.color);
    drawRect(p2.x,p2.y,p2.width,p2.height,p2.color);
    drawCircle(ball.x,ball.y,ball.r,ball.color);   
    drawText(p1.score, (canvas.width)/4, (canvas.height)/5);
    drawText(p2.score, 3*(canvas.width)/4, (canvas.height)/5);
}


function collision() {
    if(ball.x <= 10) {
        if(ball.y>=(p1.y) && (ball.y<=(p1.y+70))) {
            ball.velocityX = -ball.velocityX;
            nextRound();
        }else {
            p2.score++;
            reset();
        }
    }else if(ball.x >= (canvas.width-10)) {
        if(ball.y>=(p2.y) && (ball.y<=(p2.y + 70))) {
            ball.velocityX = -ball.velocityX;
            nextRound();
        }else {
            p1.score++;
            reset();
        }
    }
}
function nextRound() {
    round++;
    if(round>=lastRound+10) {
        lastRound = round;
        if(ball.velocityX < 0) ball.velocityX -= 1;
        else ball.velocityX += 1;
        if(ball.velocityY < 0) ball.velocityY -= 1;
        else ball.velocityY += 1;
    }
}

function reset() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = 2;
    ball.velocityY = 2;
    p1.x = 0;
    p1.y = (canvas.height)/2 - 35; 
    p2.x = (canvas.width - 10);
    p2.y = (canvas.height)/2 - 35;
    round=0;
    lastRound=0;
}



// Move the Handle
function up1() {
    p1.y-=20;
    render();
}
function down1() {
    p1.y+=20;
    render();
}
function up2() {
    p2.y-=20;
    render();
}
function down2() {
    p2.y+=20;
    render();
}
render();
//send();
var game = window.setInterval(()=>{
    collision();
    update();
    render();
    //send();
},25);


function stop() {
    clearInterval(game);
}

// function send(val) {
//   console.log("sending..");
//     socket.emit('playpingpong', {
//         p1 : p1,
//         p2 : p2,
//         ball : ball,
//         net : net
//     });
// }

// socket.on('playpingpong', (data) => {
//     p1 = data.p1;
//     p2 = data.p2;
//     ball = data.ball;
//     net = data.net;
// });
