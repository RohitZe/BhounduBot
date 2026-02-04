const jwt=require('jsonwebtoken');
const {httpResponses}=require('../utils/http-responses');
const {httpStatusCodes}=require('../utils/http-status-codes');
const {getUserById}=require('../dbQuery')


exports.verifyToken = function (req, res, next) {
  const token = req.headers["authorization"];
  const result = token ? token.substr(token.indexOf(" ") + 1) : false;
  if (!result) {
    return res.status(httpStatusCodes.SUCCESS).send({
      status: false,
      code: httpStatusCodes.UNAUTHORIZED,
      statusCode: httpResponses.SESSION_EXPIRE,
      message: serverResponseMessage.SESSION_EXPIRE,
    });
  }
  jwt.verify(result, 'Rohit@(123)', async (err, decoded) => {
    if (err) {
      return res.status(httpStatusCodes.SUCCESS).send({
        status: false,
        code: httpStatusCodes.UNAUTHORIZED,
        statusCode: httpResponses.SESSION_EXPIRE,
        message: serverResponseMessage.SESSION_EXPIRE,
      });
    }
    const user = await getUserById(decoded.userId);
    
      if (!user) {
        return res.status(httpStatusCodes.SUCCESS).send({
          status: false,
          code: httpStatusCodes.UNAUTHORIZED,
          statusCode: httpResponses.EMAIL_NOT_VERIFIED,
          message: serverResponseMessage.USER_NOT_VERIFIED,
        });
      }
    req.userId = decoded.userId;
    req.decodedToken = decoded;
    next();
  });
};

exports.generateToken = async (user) => {
  let userData = {
    userId: user._id,
  };
  return jwt.sign(userData, 'Rohit@(123)', {
    expiresIn: '30d',
  });
};

exports.generateTemporaryToken = async (userId) => {
  let userData = {
    userId: userId,
  };
  return jwt.sign(userData, 'Rohit@(123)', {
    expiresIn: '30m',
  });
};