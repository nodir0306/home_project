import { Router } from "express";
import authController from "./auth.controller.js";
import ValidationMiddleware from "../../middleware/validation.middleware.js";
import { resetPasswordValidation } from "./dtos/password.reset.dto.js";
import { verifyOTPDto } from "./dtos/otp.dto.js";

const authRoutes = Router();

authRoutes
  .post("/login", authController.signin)
  .post("/forgot-password", authController.forgotPasswordApi)
  .post(
    "/reset-password/:token",
    ValidationMiddleware(resetPasswordValidation),
    authController.resetPasswordApi
  )
  .post(
    "/generate-otp",
    authController.generateOtpPassword
  )
  .post("/verify-otp",
    ValidationMiddleware(verifyOTPDto),   
    authController.verifyOtp)
  .post("/refresh-token",authController.refreshToken)
  .post("/logout",authController.logout)

export default authRoutes;
