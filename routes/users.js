const express=require("express");
const router=express.Router();
const bcrypt= require("bcryptjs");
const passport= require("passport");
const flash= require("connect-flash");
const{ensureAuthenticated}=require("../configs/auth");

//using mongoose model
const User= require("../schema&models/schema");

//hasing the password
const salt= bcrypt.genSaltSync(10);

//login page
router.get("/login",(req,res)=>{
      res.render("login");
});

//login handle

router.post("/login",(req,res,next)=>{                //we are using passport to authenticate
      
      passport.authenticate('local',
         {   successRedirect: "/users/dashboard",
             failureFlash: req.flash("error_password","Incorrect Password"),
             failureRedirect: "/users/login"
          })(req,res,next);      
});


//register page
router.get("/register",(req,res)=>{
      res.render("register");
});

//register handle
router.post("/register",(req,res)=>{
   
     const {name,email,password,password2}= req.body;
     let errors=[];

          
     //check if all the fields are filled
      if(!name || !email || !password || !password2){
               errors.push({msg: "Please fill in all the fields"});
      }
      
     //check if the password and the confirm password match
     if(password!= password2){
          errors.push({msg:"Passwords do not match"});
     }

     //password length 
     if(password.length<6){
          errors.push({msg:"Password should be atleast 6 characters"});
     } 
    
    if(errors.length >0){
       res.render("register",{errors,name,email,password,password2}); 
    }else{
          //passed 
            
          User.findOne({email:email},function(err,docs){
                  if(docs){
                           errors.push({msg: "Email already exists"});
                           res.render('register',{errors,name,email,password,password2});
                   }else{
                         bcrypt.genSalt(10,function(err,salt){
                              bcrypt.hash(password,salt,function(err,hash){   
                               const newUser= new User({
                                     name,
                                     email,
                                     password: hash
                                });
                                newUser.save();
                                req.flash("success_msg","You are now registered and can login");    //can be found on the npm package document 
                                res.redirect("/users/login");
                         });
                         });
                   }
           });
    }
});

//dashboard page

router.get("/dashboard",ensureAuthenticated,(req,res)=>{
      res.render("dashboard",{name:req.user.name}); 
});

//logout page
router.get("/logout",(req,res)=>{
       req.logout();
       req.flash("success_msg","You are logged out");
       res.redirect("/users/login");
});

module.exports= router;