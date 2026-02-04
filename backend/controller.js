const {httpStatusCodes}=require('./utils/http-status-codes');
const {serverResponseMessage}=require('./message');
const {httpResponses}=require('./utils/http-responses')
const { doesUserExists, createUser, setToken } = require('./dbQuery');
const { success } = require('./utils/response');
const { hashPassword, comparePassword } = require('./utils/common');
const { generateToken} = require('./services/auth');
const {generateOtpandexpirationTime,sendEmail}=require('./utils/common')
const jwt = require("jsonwebtoken");

const USER_DOMAIN_URL='http://localhost:5173'



exports.registerUserController = async (req,res)=> {
    
    const {userName,firstName,lastName,email,password,dob}=req.body;

    const userEmail=email.toLowerCase();

    const existingUser=await doesUserExists(userEmail);  
    if (existingUser) {
    throw {
      code: httpStatusCodes.UNPROCESSABLE_ENTITY,
      message: serverResponseMessage.USER_ALREADY_EXSITS,
    };
    }

    const hashedPassword = await hashPassword(password);

    req.body.password=hashedPassword;

    const {otp,expirationTime}=await generateOtpandexpirationTime();

    req.body.otp=otp;
    req.body.expirationTime=expirationTime;

  const sentEmail=await sendEmail(
    userEmail,
    "OTP Verification",
    `<p>Your OTP is: ${otp}</p>`
  );


    
    const createdUser=await createUser(req.body);
    if(!createdUser)
    {
     throw {
        code:httpStatusCodes.INTERNAL_SERVER_ERROR,
        message:serverResponseMessage.CATCH_ERR
     }
    }



    return res.json(
        success(
      httpStatusCodes.SUCCESS,
      httpResponses.SUCCESS,
      serverResponseMessage.USER_CREATED_SUCCESSFULLY,
      null
    )
  );

};

exports.verifyOTPController = async (req, res) => {
  const { email, otp } = req.body;

  const userEmail = email.toLowerCase();


  if (!otp || otp.toString().trim() === '') {
    throw {
      code: httpStatusCodes.UNPROCESSABLE_ENTITY,
      message: 'OTP is required'
    };
  }

  const user = await doesUserExists(userEmail);
  if (!user) {
    throw {
      code: httpStatusCodes.NOT_FOUND,
      message: serverResponseMessage.USER_NOT_FOUND
    };
  }


  if (user.isVerified) {
    throw {
      code: httpStatusCodes.UNPROCESSABLE_ENTITY,
      message: 'User already verified'
    };
  }


  if (!user.otp) {
    throw {
      code: httpStatusCodes.UNPROCESSABLE_ENTITY,
      message: 'OTP not found. Please request a new one'
    };
  }

  const currentTime = new Date();
  

  if (currentTime > user.expirationTime) {
    throw {
      code: httpStatusCodes.UNPROCESSABLE_ENTITY,
      message: 'OTP has expired. Please request a new one'
    };
  }

  if (otp.toString() !== user.otp.toString()) {
    throw {
      code: httpStatusCodes.UNPROCESSABLE_ENTITY,
      message: 'Invalid OTP'
    };
  }
  user.isVerified = true;
  user.status = true;
  user.otp = null; 
  user.expirationTime = null;
  
  await user.save();

  return res.json(
    success(
      httpStatusCodes.SUCCESS,
      httpResponses.SUCCESS,
      serverResponseMessage.OTP_VERIFIED
    )
  );
};
exports.loginUserController=async(req,res)=>{
 

  const{email,password}=req.body;
  const user_email=email.toLowerCase();
  const user= await doesUserExists(user_email);
  if(!user)
  {
   throw {
      code: httpStatusCodes.NOT_FOUND,
      message: serverResponseMessage.USER_NOT_FOUND,
    };
  }

 const isPasswordValid=await comparePassword(password,user.password);

 if(!isPasswordValid)
 {
  throw {
    code:httpStatusCodes.UNPROCESSABLE_ENTITY,
    message:serverResponseMessage.INVALID_PASSWORD
  }
 }

 const token=await generateToken(user);

 const updatedUser=setToken(user._id,token);
 if(!updatedUser)
 {
  throw {
    code:httpStatusCodes.UNPROCESSABLE_ENTITY,
    message:serverResponseMessage.CATCH_ERR
  }
 }
 
 return res.json(success(
  httpStatusCodes.SUCCESS,
  httpResponses.SUCCESS,
  serverResponseMessage.LOGIN_SUCCESSFULLY,
  token
 ));
 

};
