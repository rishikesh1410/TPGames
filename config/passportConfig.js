const passport = require('passport');
const mysql = require('mysql');
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "tpgames"
    });
    con.connect(function(err){
        if(err) console.log(err);
        else{
            let sql = "SELECT * FROM users WHERE email='"+email+"'";
            con.query(sql,function(err,result){
                if(err) console.log(err);
                else {
                    con.end(function(err){
                        if(err) console.log(err);
                        else{
                            done(null,result[0]);
                        }
                    });
                }
            });
        }
    });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "tpgames"
    });
    con.connect(function(err){
        if(err) console.log(err);
        else{
            let sql = "SELECT * FROM users WHERE email='"+username+"' and password='"+password+"'";
            con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                    con.end(function(err){
                        if(err) console.log(err);
                        else{
                            if(result.length!=0) {
                                done(null,result[0]);
                            }else {
                                done(null,false);
                            }
                        }
                    });
                }
            });
        }
    });
  }
));