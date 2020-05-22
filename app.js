const express = require('express');
const logger = require('morgan');
const socket = require('socket.io');
const port = process.env.PORT || 9090;

const app = express();

app.use(logger('combined'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res)=>{
    res.render('tictactoe');
});
app.get('/tetris', (req,res)=>{
    res.render('tetris');
})

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

    socket.on('playtetris', (data) => {
        console.log(data);
        io.sockets.emit('playtetris', data);
    });
});
