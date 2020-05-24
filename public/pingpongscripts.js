var canvas = document.getElementById("pingpong-board");
var ctx = canvas.getContext("2d");

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
    if(ball.x == 10) {
        if(ball.y>=(p1.y) && (ball.y<=(p1.y+70))) {
            ball.velocityX = -ball.velocityX;
        }else {
            p2.score++;
            reset();
        }
    }else if(ball.x == (canvas.width-10)) {
        if(ball.y>=(p2.y) && (ball.y<=(p2.y + 70))) {
            ball.velocityX = -ball.velocityX;
        }else {
            p1.score++;
            reset();
        }
    }
}

function reset() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    p1.x = 0;
    p1.y = (canvas.height)/2 - 35; 
    p2.x = (canvas.width - 10);
    p2.y = (canvas.height)/2 - 35;
}



// Move the Handle
function up1() {
    p1.y-=10;
    render();
}
function down1() {
    p1.y+=10;
    render();
}
function up2() {
    p2.y-=10;
    render();
}
function down2() {
    p2.y+=10;
    render();
}
render();
var game = window.setInterval(()=>{
    collision();
    update();
    render();
},25);


function stop() {
    clearInterval(game);
}