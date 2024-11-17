const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

const sessionOption = {
     secret: "mysupersecretstring",
     resave: false,
    saveUninitialized: true,
    };
    app.use(session(sessionOption));
    app.use(flash());

    

    app.get("/register",(req,res) =>{
        let {name = "anonymous"} = req.query;
        req.session.name = name;
       if(name === "anonymous"){
        req.flash("error","user not register");
       }else{
        req.flash("sucess","user register succesfully");
       }
       res.redirect("/hello");
    });

    app.get("/hello",(req,res)=>{
      res.locals.successMsg = req.flash("sucess");
      res.locals.errorMsg  = req.flash("error");
     res.render("page.ejs",{name:req.session.name});
    });

// app.get("/reqcount", (req,res) =>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// })

app.listen(3000,() =>{
    console.log("server is listening to 3000")
});