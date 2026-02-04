const {failure}=require('./response');
const { httpResponses } = require('../utils/http-responses');
const {httpStatusCodes}=require('../utils/http-status-codes')
const { serverResponseMessage } = require('../message');

function asyncHandler(requestHandler) {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            console.log("Error in Async Handler:", err);

            let customError = "";
            if (err.code === "DUPLICATE_FIELD_VALUE_ERROR") {
                customError = err.message;
            }

            const resStatusCode =
                err.code && err.code >= 400 && err.code <= 599
                    ? err.code
                    : httpStatusCodes.ERROR;

            if (err && err.stack) {
                console.log("Async Handler Log:", {
                    error: customError || err.message,
                    time: new Date().toISOString(),
                });
            }
            const errorData = process.env.NODE_ENV === 'development' 
                ? { stack: err.stack }
                : null;

            return res.status(resStatusCode).json(
                failure(
                    resStatusCode,
                    httpResponses.ERROR,
                    customError || err.message || serverResponseMessage.INTERNAL_SERVER_ERROR,
                )
            );
        });
    };
}

module.exports = asyncHandler;