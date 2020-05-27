const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const home = express.Router();

home.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res)=>{
    let user = req.user;
    res.render('home', {'name' : user.name});
});

module.exports = home;