"use strict";
const { httpStatusCodes } = require('../utils/http-status-codes');
const { httpResponses } = require('../utils/http-responses');
const { failure } = require('../utils/response');


const validation = (schema) => {
  return async (req, res, next) => {
    let reqData = { ...req.body };

    if (Object.keys(req.params).length) reqData = { ...reqData, ...req.params };
    if (Object.keys(req.query).length) reqData = { ...reqData, ...req.query };
    if (req.file) reqData = { ...reqData, image: req.file };

    const { error, value } = schema.validate(reqData, { convert: true });

    if (!error) {
      req.body = value;
      return next();
    }

    const message = error.details.map((i) => i.message).join(", ");
    console.log("Validation error: ", message);

    return res.status(httpStatusCodes.BAD_REQUEST || 400).json(
      failure(
        httpStatusCodes.BAD_REQUEST || 400,
        httpResponses.ERROR || 'error',
        message,
      )
    );
  };
};

module.exports = validation;