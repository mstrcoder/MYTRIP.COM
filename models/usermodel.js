const mongoose = require('mongoose');
const validator = require("validator");
const UserSchema=new mongoose.Model({
    name:{
        type: 'string',
        required: [true,'Please Tell Your name']
    }, 
    email:{
        type: 'string',
        required: [true,'Please Tell Your email'],
        unique:true, 
        lowerCase:true, 
        validate:[validator.isEmail,'Please provide valid Email']
    },
    photo:String, 
    password:{
        type: 'string',
        required: [true,'Please provide a valid password'],
        minlength:8 

    },
    paswordConfirm:{
        type:String,
        required: [true,'Please provide the Password']
    }
});

const user=mongoose.model('UserSchema',UserSchema)
module.exports=user;
