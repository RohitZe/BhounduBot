"use strict";
const { serverResponseMessage } = require('../message');
const { httpStatusCodes } = require("./http-status-codes");

exports.success = function (code, status, message,data) {
  const SucessResponse = {
    code: code,
    statusCode: status,
    success: true,
    message: message,
    data:data
  };

  console.log("API Success Response");

  return SucessResponse;
};

exports.failure = function (code, status, message) {
  const FailureResponse = {
    code: code,
    statusCode: status,
    success: false,
    message: message,

  };

  console.error("API Failure Response", {
    meta: { data: FailureResponse }
  });

  return FailureResponse;
};

exports.error = function (
  code = httpStatusCodes.INTERNAL_SERVER_ERROR,
  status,
  message = serverResponseMessage.INTERNAL_SERVER_ERROR,
  data
) {
  const ErrorResponse = {
    code: code,
    statusCode: status,
    success: false,
    message: message,
    data: data,
  };

  console.error("API Error Response", {
    meta: { data: ErrorResponse },
  });

  return ErrorResponse;
};
