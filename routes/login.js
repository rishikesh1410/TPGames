const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const login = express.Router();

login.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res)=>{
    res.render('login');
})
.post(urlencodedParser, passport.authenticate('local', { failureRedirect: '/login?signup=0' }),(req,res)=>{
    console.log(req.user);
    res.redirect('/home');
});

module.exports = login;