import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    email : {
        type : String,
        required : true,
        unique : true

    },
    password :{
        type : String,
        required : true
    },
    isBlocked : {
        type : Boolean,
        default : false
    },

    role :{
        type : String,
        required : true,
        default :"customer"
        
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    profilePicture : {
        type : String,
        required : true,
        default:"https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
    },
    emailVerified : {
        type : Boolean,
        required : true,
        default : false
    }
});

const User = mongoose.model("User",userSchema);

export default User;
