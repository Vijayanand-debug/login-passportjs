const mongoose= require("mongoose");

//mongo Schema
const userSchema= new mongoose.Schema({
      
      name:{
        type: String,
        required: true
      },

      email:{
        type: String,
        required: true
      },

      password:{
        type: String,
        required: true
      },
      
      date:{
        type: Date,
      }
});

//creating a model

const User= mongoose.model('User',userSchema);

module.exports= User;