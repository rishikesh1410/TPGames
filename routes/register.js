const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
const io = require('socket.io-client');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const register = express.Router();

register.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res)=>{
    res.render('register');
})
.post(urlencodedParser, (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "tpgames"
    });
    con.connect(function(err) {
        if (err) throw err;
        let sql = "INSERT INTO users (email,password,name) VALUES('"+email+"', '"+password+"','"+name+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            else {
                con.end(function(err){
                    if(err) console.log(err);
                    else{
                        console.log("User Created");
                        res.redirect('/login');
                    }
                });
            }
        });
    }); 
})

module.exports = register;