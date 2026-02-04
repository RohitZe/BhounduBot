const express = require('express');
const router = express.Router();
const {createUser, loginUser, verifyUser}=require('./validation')
const {registerUserController, loginUserController, verifyOTPController}=require('./controller')
const asyncHandler=require('./utils/asyncHandler')
const validationMiddleware=require('./middlewares/middleware');


router.post(
  '/register',
  validationMiddleware(createUser),
  asyncHandler(registerUserController)
);

router.post(
  '/verify-otp',
  validationMiddleware(verifyUser),
  asyncHandler(verifyOTPController)
)

router.post(
  '/login',
  validationMiddleware(loginUser),
  asyncHandler(loginUserController)
);


module.exports = router;