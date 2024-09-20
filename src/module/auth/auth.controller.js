import bcrypt from "bcrypt";
import { signToken, verifyRefreshToken, verifyToken } from "../../helper/jwt.helper.js";
import User from "../user/user.schema.js";
import { ConflictException, NotFoundErr } from "../../exceptions/all.backend.exceptions.js";
import crypto from "crypto"
import { appConfig } from "../../config/app.config.js";
import { sendMailFunction } from "../../utils/report-mail.settings.js";
import passwordResetConfig from "../../config/password.reeset.config.js";
import generateRandomOTP from "../../utils/generateOtp.js";
import OTP from "./otp.schema.js";
import jwtConfig from "../../config/jwt.config.js";
import jwt from "jsonwebtoken"


class AuthController {
  #_userModel;
  #_otpModel;
  constructor() {
    this.#_userModel = User;
    this.#_otpModel = OTP
  }

  signin = async (req, res, next) => {
    try {
        const foundedUser = await this.#_userModel.findOne({
            phone: req.body.phone,
          });
      

      if (!foundedUser) {
        throw new NotFoundErr("Invalid password or [phone, email");
      }

      const result = await bcrypt.compare(
        req.body.password,
        foundedUser.password
      );

      if (!result) {
        return res.status(409).send({
          message: "Invalid password or [phone, email]",
        });
      }
      const userStatus = foundedUser.isbanned
      if(userStatus){
        return res.status(401).send({
          message: "banned"
        })
      }

      const accessToken = signToken({
        id: foundedUser.id,
        role: foundedUser.role,
      },jwtConfig.secretKey,jwtConfig.expireTime);

      const refreshToken = signToken({
        id: foundedUser.id,
        role: foundedUser.role,
      },jwtConfig.refreshTokenSecretKey,jwtConfig.refreshTokenExpireTime)


      res.cookie("token", accessToken, { maxAge: 1000 * 60 *60* 24, signed: false });
      res.cookie("role", foundedUser.role, { maxAge: 1000 * 60 * 60* 24, signed: false });
      res.cookie("refreshToken",refreshToken,{ maxAge: 1000 * 60 * 60 * 24 * 30, signed: false});
      res.send({
        message: "success",
        token: accessToken,
        refreshToken: refreshToken,
        userId: foundedUser.id,
        role: foundedUser.role,
      });

    } catch (error) {
      next(error);
    }
  };

  refreshToken = (req,res,next)=>{
    try {
      const {refreshToken} = req.cookies
    if(!refreshToken){
      throw new NotFoundErr("Refresh token not found")
    }
    verifyRefreshToken(refreshToken)
    const foundedUSer = jwt.verify(refreshToken, jwtConfig.refreshTokenSecretKey);

    const newAccessToken = signToken(
      { id: foundedUSer.id, role: foundedUSer.role },
      jwtConfig.secretKey,
      jwtConfig.expireTime
    );

    const newRefreshToken = signToken(
      { id: foundedUSer.id },
      jwtConfig.refreshTokenSecretKey,jwtConfig.refreshTokenExpireTime
    );


    res.cookie("token", newAccessToken, {
      maxAge: 1000 * 60 *60 * 60*24,
      signed: false,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      signed: false,
    });

    res.send({
      message: "Token refreshed successfully",
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
    } catch (error) {
      next(error)
    }
    
  }


  logout = async(req,res,next)=>{
    try {
      res.clearCookie("token")
      res.clearCookie("refreshToken")
      res.clearCookie("role")
      res.status(200).send({
        message: "ok"
      })
    } catch (error) {
      next(error)
    }
  }


  resetPasswordApi = async(req,res,next)=>{
    try {
      const {password} = req.body
      const token = req.params.token;
      const foundedUser = await this.#_userModel.findOne({
        passwordResetToken: token,
      });
      if(!foundedUser){
        throw new NotFoundErr("User not found")
      }

      if(foundedUser.passwordResetTokenExpireTime - Date.now()<0){
        throw new ConflictException("Password reset time arleady expired")
      }
      const hashedPass = await bcrypt.hash(password,12)
      await this.#_userModel.findByIdAndUpdate(foundedUser.id,{
        password: hashedPass,
        passwordResetToken: null,
        passwordResetTokenExpireTime: null,
      })


      res.status(200).send({
        message: "success"
      })
    } catch (error) {
      next(error)
    }
  }


  forgotPasswordApi = async(req,res,next)=>{
    try {
      const{email} = req.body;
      const foundedUser = await this.#_userModel.findOne({email});

      if(!foundedUser){
        throw new NotFoundErr("User not found")
      }

      const generatedText = crypto.randomBytes(32).toString("hex")

      const passwordResetUrl = `${req.protocol}://${req.host}:${appConfig.port}/reset-password/${generatedText}`

      const mail_options = {
        from: process.env.REPORTS_EMAIL,
        to: foundedUser.email, 
        subject: "Your reset Password link",
        html: `
        Tugmani bosing: <a href="${passwordResetUrl}" style="border-radius: 10px; display: flex; align-items: center; justify-content: center; width: 100px; height: 35px; background-color: limegreen; border: none;">Reset password</a>
        `,
      };
      sendMailFunction(mail_options)
      await this.#_userModel.findByIdAndUpdate(foundedUser.id,{
        passwordResetToken: generatedText,
        passwordResetTokenExpireTime: Date.now()+Number(passwordResetConfig.expireTime)*1000,
      });
      res.status(200).send({message: "succes"})

    } catch (error) {
      next(error)
    }
  }

  generateOtpPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const foundedUser = await this.#_userModel.findOne({ email });
      const userId = foundedUser.id
      if (!foundedUser) {
        return res.status(404).send({
          name: "Not Found Error",
          message: "User not found",
        });
      }
  
      const otp = generateRandomOTP();
      const verifyText = crypto.randomBytes(64).toString("hex");
  
      const createOTP = await this.#_otpModel.create({
        email,
        verifyText,
        code: otp,
      });

      await this.#_userModel.findByIdAndUpdate(userId, {
        $push: { otp: createOTP._id }
    });
  
      const mail_options = {
        from: process.env.REPORTS_EMAIL,
        to: email,
        subject: "Your reset Code",
        html: `<h1>Your verification code: ${otp}</h1>`,
      };
  
      sendMailFunction(mail_options);
  
      res.status(200).send({ 
        name: "success",
        userId: foundedUser.id 
      });
    } catch (error) {
      next(error);
    }
  };
  
  verifyOtp = async (req, res, next) => {
    try {
      const { code, verifyText } = req.body;
      const foundedOTP = await this.#_otpModel.findOne({ code, verifyText });
      if(foundedOTP.code != code){
        throw new ConflictException("The entered code is incorrect")
      }
      if (!foundedOTP) {
          throw new ConflictException("OTP time arleady exists")
      }
  
      const foundedUser = await this.#_userModel.findOne({ email: foundedOTP.email });
  

  
      await this.#_otpModel.findByIdAndDelete(foundedOTP.id);

      const accessToken = signToken({
        id: foundedUser.id,
        role: foundedUser.role,
      });
  
      res.cookie("token", accessToken, { maxAge: 1000 * 60 * 60 * 24 });
      res.cookie("role", foundedUser.role, { maxAge: 1000 * 60 * 60 * 24 });
  
      res.status(200).send({
        message: "success",
        token: accessToken,
        userId: foundedUser.id,
        role: foundedUser.role,
      });
    } catch (error) {
      next(error);
    }
  };
  
  
}


export default new AuthController;