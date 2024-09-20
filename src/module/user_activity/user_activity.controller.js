import User from "../user/user.schema.js";
import ACTIVITY from "./user_activity.schema.js";
import UAParser from "user-agent-parser"
class activityController {
    #_myActivity;
    #_userModel
    constructor(){
        this.#_myActivity = ACTIVITY
        this.#_userModel = User
    }

    createActivity = async(req,res,next)=>{
        try {
            const {user,userId} = req.body;
            const parser = new UAParser(user);
            console.log(user)
            const newUserActivity = await this.#_myActivity.create({
                browser: `${parser.getBrowser().name}`,
                os: parser.getOS().name,
                userId: userId
            });

            await this.#_userModel.findByIdAndUpdate(userId, {
                $push: { userActivity: newUserActivity._id }
            });
        } catch (error) {
            next(error)
        }
    }
}

export default new activityController;