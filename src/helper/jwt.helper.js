import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.config.js";
import { BadRequestsErr,TokenExpiredException} from "../exceptions/all.backend.exceptions.js";

export const signToken = (tokenData, jwtSecret,jwtExpireTime) =>
  jwt.sign(tokenData, jwtSecret, {
    expiresIn: jwtExpireTime,
  });

export const verifyToken = (token) =>
  jwt.verify(token, jwtConfig.secretKey, (err, _) => {
    if (err && err instanceof jwt.NotBeforeError) {
      throw new BadRequestsErr("Not before JWT error");
    }

    if (err && err instanceof jwt.TokenExpiredError) {
      throw new TokenExpiredException("Token already expired");
    }
    
    if (err && err instanceof jwt.JsonWebTokenError) {
      throw new BadRequestsErr("Invalid JWT token");
    }
  });

  export const verifyRefreshToken = (token) =>
    jwt.verify(token, jwtConfig.refreshTokenSecretKey, (err, _) => {
      if (err && err instanceof jwt.NotBeforeError) {
        throw new BadRequestsErr("Not before JWT error");
      }
  
      if (err && err instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredException("Token already expired");
      }
      
      if (err && err instanceof jwt.JsonWebTokenError) {
        throw new BadRequestsErr("Invalid JWT token");
      }
    });
  
