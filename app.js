require('dotenv').config();
const express= require("express");
const ejs= require("ejs");
const mongoose= require("mongoose");
const flash= require("connect-flash");
const session= require("express-session");
const passport= require("passport");
const bcrypt= require("bcryptjs");

const app=express();

//passport config or requiring the passport local strategy
require("./configs/passport")(passport);             //first the location and then requiring the object itself 


//EJS
app.set('view engine','ejs');
app.use(express.static('public'));

//bodyparser is already a part of express 
app.use(express.urlencoded({extended:true}));

// Express Session Midddleware 
app.use(session({
  secret:process.env.SECRET,
  resave: true,
  saveUninitialized: true,
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware 
app.use(flash());

// Global variables custom middleware
app.use((req,res,next )=>{
   res.locals.success_msg= req.flash("success_msg");
   res.locals.error_msg= req.flash("error_msg");
   res.locals.error_password= req.flash("error_password");
   next();   
});

const PORT= process.env.PORT||3000;

//mongoose connection
mongoose.connect('mongodb://localhost:27017/media',{useNewUrlParser: true, useUnifiedTopology: true});



//Routes
app.use("/",require("./routes/index"));

app.use("/users",require("./routes/users"));

app.listen(PORT,function(){
           console.log("Server is up and running on "+PORT);
});