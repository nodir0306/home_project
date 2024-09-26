import { isValidObjectId } from "mongoose";
import { BadRequestsErr, NotFoundErr } from "../../exceptions/all.backend.exceptions.js";
import getItemFilter from "../../utils/api.feature.util.js";
import User from "./user.schema.js";
import bcrypt from "bcrypt"
import Home from "../home/home.schema.js";
class UserController {
  #_user_model;
  #_homeModel
  constructor() {
    this.#_user_model = User;
    this.#_homeModel = Home;
  }

  createUser = async(req, res, next) => {
    try {
      const {password, password_repeat} = req.body;
      if(password !== password_repeat){
        return res.status(200).send({
          name: "Validation error",
          message: "Password no match"
        })
      }
      const hashedPass = await bcrypt.hash(req.body.password,12);

      await this.#_user_model.create({
        ...req.body,
        password: hashedPass,
      });   
      res.status(201).send({
        message: "created",
      });
    } catch (error) {
      next(error);
    }
  };
  getAllUsers = async (req, res, next) => {
    try {
      const query = { ...req.query };
      const allUsers = await new getItemFilter(this.#_user_model.find({}), query)
        .filter()
        .getQuery()
        .countDocuments();

      const allFilteredUsers = await new getItemFilter(
        this.#_user_model.find({role: "user"}),
        query
      )
        .filter()
        .paginate()
        .getQuery().populate("homes");
      res.send({
        message: "success",
        page: req.query?.page || 0,
        limit: req.query?.limit || 10,
        results: allUsers,
        data: allFilteredUsers,
      });
    } catch (error) {
      next(error);
    }
  };

  getOneUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const foundedUser = await this.#_user_model.findById(id).populate("homes").populate("otp").populate("userActivity").populate({path: "likes", select: "home_id"});
      res.status(200).send({
        message: "succes",
        data: foundedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      this.#_isValidObjectId(id)
      const findUserHomes = await this.#_homeModel.find({userId: id})
      for (const home of findUserHomes) {
        await this.#_homeModel.findByIdAndDelete(home._id);
      }

      await this.#_user_model.findByIdAndDelete(id);
      res.status(200).send({
        message: "deleted",
      });
    } catch (error) {
      next(error);
    }
  };

  
  updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      this.#_isValidObjectId(id)
      const foundedUser = await this.#_user_model.findById(id)
      if(!foundedUser){
        throw new NotFoundErr("User not fount")
      }
      const { phone, email, surname, name, password } = req.body;
      if(password){
        const hashedPass = await bcrypt.hash(password,12);
        await this.#_user_model.findByIdAndUpdate(id, {
          $set: {
            password: hashedPass,
          },
      })
    }
      await this.#_user_model.findByIdAndUpdate(id, {
        $set: {
          phone: phone,
          name: name,
          surname: surname,
          email: email,
        },
      });
      res.status(200).send({
        message: "updated",
      });
    } catch (error) {
      next(error);
    }
  };






  banUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      this.#_isValidObjectId(id)
      const foundedUser = await this.#_user_model.findById(id)
      if(!foundedUser){
        throw new NotFoundErr("User not fount")
      }
      await this.#_user_model.findByIdAndUpdate(id, {
        $set: {
          isbanned: true
        },
      });
      res.status(200).send({
        message: "banned",
      });
    } catch (error) {
      next(error);
    }
  };



  unBanUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      this.#_isValidObjectId(id)
      const foundedUser = await this.#_user_model.findById(id)
      if(!foundedUser){
        throw new NotFoundErr("User not fount")
      }
      await this.#_user_model.findByIdAndUpdate(id, {
        $set: {
          isbanned: false
        },
      });
      res.status(200).send({
        message: "Unbanned",
      });
    } catch (error) {
      next(error);
    }
  };


  #_isValidObjectId = (id)=>{
    if(!isValidObjectId(id)){
      throw new BadRequestsErr("This is object id not supported")
    }
  }
}

export default new UserController();
