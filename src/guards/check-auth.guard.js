import jwt from "jsonwebtoken";
import { verifyToken } from "../helper/jwt.helper.js";
import { BadRequestsErr } from "../exceptions/all.backend.exceptions.js";

export const CheckAuthGuard = (isProtected) => {
  return (req, _, next) => {
    if (!isProtected) {
      return next();
    }

    // const token = req.headers["authorization"];
    const token = req.cookies["token"];
    // if (!(token && token.startsWith("Bearer") && token.split(" ")[1])) {
    //   throw new BadRequestsErr(`Your token: ${token} not work`);
    // }
    if (!token) {
      throw new BadRequestsErr("Token not found in cookies");
    }


    const accessToken = token
    verifyToken(accessToken);

    const { id, role } = jwt.decode(accessToken);
    req.userId = id;
    req.role = role;

    next();
  };
};