module.exports={
   ensureAuthenticated:function(req,res,next){
         if(req.isAuthenticated()){ 
               return next();
         }
         req.flash("error_msg","You are logged out, please login again");
         res.redirect("/users/login");
   }      
}

/*documentation cannot be found on passportjs website,
but is found on the github repository for passport js.
ensureAuthenticated is a function and we can require 
it anywhere or with any page we want to secure.
*/