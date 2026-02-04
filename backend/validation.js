const Joi = require('joi');

const createUser = Joi.object({
 
 fullName: Joi.string().min(2).max(50).required().messages({
    "any.required": "User name is required.",
    "string.empty": "User name cannot be empty.",
  }),
   
  email: Joi.string().email().required().trim().lowercase().messages({
    "any.required": "Email is required.",
    "string.email": "Invalid email format.",
    "string.empty": "Email cannot be empty.",
  }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?]).{8,}$"
      )
    )
    .required()
    .messages({
      "any.required": "Password is required.",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.",
    }),
    dob: Joi.date().optional().allow(null, "")
    
})

const loginUser=Joi.object({
    email: Joi.string().email().required().trim().lowercase().messages({
    "any.required": "Email is required.",
    "string.email": "Invalid email format.",
    "string.empty": "Email cannot be empty.",
  }),
   password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?]).{8,}$"
      )
    )
    .required()
    .messages({
      "any.required": "Password is required.",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.",
    })

})

const verifyUser=Joi.object({
    email: Joi.string().email().required().trim().lowercase().messages({
    "any.required": "Email is required.",
    "string.email": "Invalid email format.",
    "string.empty": "Email cannot be empty.",
  }),
   otp: Joi.string()
    .required()
    .messages({
      "any.required": "OTP is required.",
    })

})

module.exports={createUser,loginUser,verifyUser}