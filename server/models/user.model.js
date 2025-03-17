const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    contact : {
        type : Number,
        required : true
    },
    address : {
        type : String,
        default : ""
    },
    city : {
        type : String,
        default : ""
    },
    country : {
        type : String,
       default : ""
    },
    profilePicture : {
        type : String,
        default : ""
    },
    admin : {
        type : Boolean,
        default : false
    },
    // advance authentication
    lastLogin : {
        type : Date,
        default : Date.now
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    resetPasswordToken : {
        type : String,
    },
    resetPasswordTokenExpiresAt : {
        type : Date
    },
    verificationCode : {
        type : String
    },
    verificationCodeExpiresAt : {
        type : Date
    }
}, {timestamps : true})

const User = mongoose.model("User", userSchema)
module.exports = User;