if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
// console.log(process.env);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo')
const flash  = require("connect-flash");
// const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//routessss
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const  MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err.message);
});
async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"mysupersecreatcode",        
    },
    touchAfter: 24*3600,
})

store.on("error",()=>{
    console.log("error in mongo session store",err)
})

const sessionOptions = {
    store,
    secret : "mysupersecreatcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:  Date.now() + 7 *24*60*60*1000,
        maxAge:  7 *24*60*60*1000,
        httpOnly: true,
    }
};



// app.get("/",(req,res)=>{
//     res.send("hii i am rooot")
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();  
  })

//   app.get("/demouser", async(req,res) =>{
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   });
//   let registerUser =  await User.register(fakeUser, "helloWorld");
//   res.send(registerUser);
//   });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

 //middlewares
     app.all("*",(req,res,next) =>{
        next(new ExpressError(404, "page not found"));
     })
     app.use((err,req,res,next) =>{
        let{statusCode = 500, message = "something went wrong!"} = err;
        res.status(statusCode).render("error.ejs",{err});
     })

app.listen(8080, ()=>{
    console.log("server is listening to port 8080")
})
// / let{title,description,image,price,country,location} = req.body;
// second method of writing
// let listing = req.body.listing;
// new Listing(listing)
// new Listing(req.body.listing);

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"calangute,goa",
//         country:"india",
//     });
//      await sampleListing.save();
//      console.log("sample was save");
//      res.send("successful testing");
// });