require("dotenv").config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema =  new mongoose.Schema({

    email: String,
    password: String
})



const User = new mongoose.model("user", userSchema);



app.get("/", function(req, res){

    res.render("home");
});

app.get("/register", function(req, res){

    res.render("register");
});

app.post("/register", function(req, res){
   

    bcrypt.hash(req.body.password, saltRounds, function(err, hash){

        const newUser  = new User({

            email: req.body.username,
            password: hash
        })
        newUser.save(function(err){
    
            if(err){
    
                console.log(err);
            } 
            else{
                   res.render("secrets");
            }
        });

    });
    
})


app.get("/login", function(req, res){

    res.render("login");
});

app.post("/login", function(req, res){

    const getUsername = req.body.username;
    const getPassword = req.body.password;

    User.findOne({"email": getUsername}, function(err, foundUser){

          if(err){

            console.log(err);
          }
          else{
            if(foundUser){
                bcrypt.compare(getPassword, foundUser.password, function(err, result){

                    if(err){
                        console.log(err);
                    }
                    else{

                        if(result === true){

                            res.render("secrets");
                        }
                    }
                })
            }
          }
    }) 
})


app.listen(3000, () => { console.log("Server is running on port 3000");})