import { isValidObjectId } from "mongoose";
import likeReport from "../like/like.schema.js"
import { BadRequestsErr, NotFoundErr } from "../../exceptions/all.backend.exceptions.js";
import Home from "../home/home.schema.js";
import User from "../user/user.schema.js";

class LikeController{
    #_likeModel
    #_userModel
    #_homeModel
    constructor(){
        this.#_likeModel = likeReport,
        this.#_homeModel = Home,
        this.#_userModel = User
    }
    createLike = async(req,res,next)=>{
        try {
            const  {userId, homeId} = req.body;
            this.#_checkValidObjectId(userId)
            this.#_checkValidObjectId(homeId)
            const foundedUser = await this.#_userModel.findById(userId)
            if(!foundedUser){
                throw new NotBeforeError("user not found")
            }
            const foundedHome = await this.#_homeModel.findById(homeId)
            if(!foundedHome){
                throw new NotFoundErr("home not found")
            }
            const foundLike = await this.#_likeModel(userId,homeId)
            if(foundLike){
                res.send({
                    message: "arledy liked"
                })
            }


            const newLike = await this.#_likeModel.create({
                userId: foundedUser.id,
                home_id: foundedHome.id,
            });

            await this.#_userModel.findByIdAndUpdate(userId, {
                $push: { likes: newLike._id }
            });

            await this.#_homeModel.findByIdAndUpdate(homeId, {
                $push: { likes: newLike._id }
            });

            res.status(201).send({
                message: "ok",
                type: "liked"
            })

            
        } catch (error) {
            next(error)
        }
    }




    #_checkValidObjectId = (id)=>{
        if(!isValidObjectId(id)){
            throw new BadRequestsErr(`The {${id}} id you provided is wrong`)
        }
    }
}

export default new LikeController;