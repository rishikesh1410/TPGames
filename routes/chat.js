const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const chat = express.Router();

chat.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res)=>{
    let user = req.user;
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "tpgames"
    });
    con.connect(function(err) {
        if (err) throw err;
        let sql = "SELECT * FROM users";
        con.query(sql, function (err, result) {
            if (err) throw err;
            else {
                con.end(function(err){
                    if(err) console.log(err);
                    else{
                        res.render('chat', {'email' : user.email, 'name' : user.name, 'users' : result});
                    }
                });
            }
        });
    });
});


chat.route('/get')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/json');
    next();
})
.get((req,res)=>{
    let user = req.user;
    let first = req.query.first;
    let second = req.query.second;
    console.log(first + " " + second);
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "tpgames"
    });
    con.connect(function(err) {
        if (err) throw err;
        let sql = "SELECT * FROM messages WHERE (`from`='"+first+"' and `to`='"+second+"') or (`from`='"+second+"' and `to`='"+first+"') ORDER BY messageid";
        con.query(sql, function (err, result) {
            if (err) throw err;
            else {
                con.end(function(err){
                    if(err) console.log(err);
                    else{
                        res.json(result);
                    }
                });
            }
        });
    });
});

module.exports = chat;