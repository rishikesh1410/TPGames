const express = require('express');
const logger = require('morgan');
const socket = require('socket.io');
const port = process.env.PORT || 9090;

const app = express();

app.use(logger('dev'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res)=>{
    res.render('tictactoe');
});
app.get('/tetris', (req,res)=>{
    res.render('tetris');
});
app.get('/tetris_2player', (req,res)=>{
    res.send('Coming Soon');
});
app.get('/pingpong', (req,res)=>{
    res.render('pingpong');
});

const server = app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

var io = socket(server);

io.on('connection', (socket)=>{
    console.log('made socket connection');
    console.log(socket.id);

    socket.on('play', (data) => {
        console.log(data);
        io.sockets.emit('play', data);
    });

    socket.on('restart', (data)=> {
        io.sockets.emit('restart', data);
    });

    socket.on('playpingpong', (data) => {
        io.sockets.emit('playpingpong', data);
    });
});
