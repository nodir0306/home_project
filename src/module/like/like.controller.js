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
    createLike = async (req, res, next) => {
        try {
            const { userId, homeId } = req.body;
            
        
            this.#_checkValidObjectId(userId);
            this.#_checkValidObjectId(homeId);
    
      
            const foundedUser = await this.#_userModel.findById(userId);
            if (!foundedUser) {
                throw new NotFoundErr("User not found");
            }
            const foundedHome = await this.#_homeModel.findById(homeId);
            if (!foundedHome) {
                throw new NotFoundErr("Home not found");
            }
    
            const foundLike = await this.#_likeModel.findOne({ userId, homeId });
            if (foundLike) {
                return res.status(200).send({
                    message: "Already liked"
                });
            }
    
        
            const newLike = await this.#_likeModel.create({
                userId: foundedUser.id,
                homeId: foundedHome.id, 
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
            });
    
        } catch (error) {
            next(error);
        }
    }
    




    #_checkValidObjectId = (id)=>{
        if(!isValidObjectId(id)){
            throw new BadRequestsErr(`The {${id}} not working`)
        }
    }
}

export default new LikeController;