// Import Libraries
const express = require('express');
const logger = require('morgan');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const mysql = require('mysql');

const passportSetup = require('./config/passportConfig');
const keys = require('./config/keys');
const port = process.env.PORT || 5000;
const users = {};

// Import Routers
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const homeRouter = require('./routes/home');
const tictactoeRouter = require('./routes/tictactoe');
const pingpongRouter = require('./routes/pingpong');
const tetrisRouter = require('./routes/tetris');
const chatRouter = require('./routes/chat');

// Create an App
const app = express();


// Setup App
app.use(logger('dev')); // For logging erros in console
app.set('view engine', 'ejs');  // For rendering dynamic content in html documents
app.use(express.static(__dirname + '/public')); // For rendering static files
app.use(bodyParser.json()); // For parsing post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
})); // Setup cookie session which will store app cookie variables for 24hrs

app.use(passport.initialize()); // Intialize passport
app.use(passport.session()); // Setup passport session for storing session variables


app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/home', homeRouter);
app.use('/tictactoe', tictactoeRouter);
app.use('/pingpong', pingpongRouter);
app.use('/tetris', tetrisRouter);
app.use('/chat', chatRouter);
app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});


// Create Server
const server = app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

// Create Server Socket
var io = socket(server);

// Listening for client socket connection
io.on('connection', (socket)=>{
    console.log('made socket connection');
    console.log(socket.id); // Connected Client Socket id

    // Connection
    socket.on('connectsocket', (data)=>{
        users[data.email]=socket.id;
        console.log("user added");
        console.log(data.email);
    });

    // Chat Event
    socket.on('chat', (data) => {
        console.log("chat");
        const con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "tpgames"
        });
        con.connect(function(err) {
            if (err) throw err;
            let sql = "INSERT INTO messages (`from`,`to`,`message`,`status`) VALUES('"+data.from+"', '"+data.to+"', '"+data.message+"', 0)";
            con.query(sql, function (err, result) {
                if (err) throw err;
                else {
                    con.end(function(err){
                        if(err) console.log(err);
                        else{
                            if(users[data.to] != undefined)
                                io.to(users[data.to]).emit('chat',data);
                        }
                    });
                }
            });
        });
    });

    // Listening for event play tictactoe game
    socket.on('playtictactoe', (data) => {
        console.log(data);
        io.sockets.emit('playtictactoe', data);
    });

    // Listening for event restart tictactoe game
    socket.on('restarttictactoe', (data)=> {
        console.log("SERVER WILL RESTART");
        io.sockets.emit('restart', data);
    });
});
