//jshint esversion:6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema =  new mongoose.Schema({

    email: String,
    password: String
})

const secret = "seddam ";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("user", userSchema);



app.get("/", function(req, res){

    res.render("home");
});

app.get("/register", function(req, res){

    res.render("register");
});

app.post("/register", function(req, res){
   
    const newUser  = new User({

        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function(err){

        if(err){

            console.log(err);
        } 
        else{
               res.render("secrets");
        }
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
                if(foundUser.password === getPassword){

                    res.render("secrets");
                }
            }
          }
    }) 
})


app.listen(3000, () => { console.log("Server is running on port 3000");})