const mongoose=require('mongoose');


const userSchema=new mongoose.Schema({
    fullName:{
      type:String,
      unique:true,
      required:true
    },
    email:{
     type:String,
     required:true,
     unique:true
    },
     password:{
        type:String,
        required:true
    },
    expirationTime:{
      type: Date, 
      default: "",
    },
    otp:{
      type:String,
      default:""
    },
    status:{
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    isVerified:{
      type:Boolean,
      enum:[true,false],
      default:false
    },
},{timestamps:true})

const User = mongoose.model('User', userSchema);
module.exports = User;


