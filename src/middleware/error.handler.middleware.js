
import logger from "../utils/logger-utils.js";
const sendDublicateFieldException = (err)=>{
    const error =  {...err};
    
    if(error.code != 11000){
        return error
    }
      error.name = "Database Validation error",
  
      error.message = `Given value ${Object.keys(error.keyValue).join(" ")} for ${Object.values(error.keyValue)} is arledy exists. Try another one!`
  
      error.statusCode = 400;
      error.isException = true;
  
    return error
  }

export const ErrorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)
    err = sendDublicateFieldException(err)
    if (err.isException) {
        logger.error(
            `Exception (${err.name}): message: ${err.message}, status: ${
              err.statusCode
            }; Time: ${new Date()}`
          );
        return res.status(err.statusCode).send({
            name: err.name,
            message: err.message,
        });
    }
    
    res.status(500).send({
        message: "Internal server error",
    });
};