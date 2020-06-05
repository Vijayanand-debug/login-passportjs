const localStrategy= require("passport-local").Strategy;
const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');

//loading user model

const User= require("../schema&models/schema");

module.exports= function(passport){
       
       passport.use(new localStrategy({usernameField:"email"},
                          (email,password,done)=>{
                            User.findOne({email: email},function(err,user){
                                 if(err){
                                         return done(err);
                                 }
                                 if(!user){
                                          return done(null,false,{msg: "That emai is not registered"});
                                 }
                                 
                                 bcrypt.compare(password,user.password,(err,results)=>{
                                           if(results === true){
                                              return done(null,user);
                                           }else{
                                                 return done(null,false,{msg: "Password Incorrect"});
                                           }
                                 });
                            });
                     }
        ));

       //after building our local strategy, we need to serialize and deserialize 
        passport.serializeUser((user, done)=> {
           done(null, user.id); 
        });

        passport.deserializeUser((id, done)=> {
            User.findById(id, (err, user)=> {
            done(err, user);
        });
        });
                                 
}