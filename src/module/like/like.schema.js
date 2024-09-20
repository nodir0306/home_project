import { Schema, model } from "mongoose";

    const likeSchema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        home_id: {
            type: Schema.Types.ObjectId,
            ref: "Home",
            required: true
        }

    }, { versionKey: false, timestamps: true });

    const like = model("like", likeSchema);
    export default like;
