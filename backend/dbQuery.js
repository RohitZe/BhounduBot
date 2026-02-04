const User = require("./model");

exports.doesUserExists= async(email) =>{
    return await User.findOne({email});
};

exports.createUser=async(userObj)=>{
   return await User.create(userObj);
}

exports.getUserById=async(_id)=>{
   return await User.findById(_id);
}
exports.setToken=async(_id,token)=>{
   return await User.findByIdAndUpdate(_id,{
     token:token
   })
}
exports.updatePassword=async(_id,password)=>{
   return await User.findByIdAndUpdate(_id,{password:password})
}