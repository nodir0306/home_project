import { Schema, model } from "mongoose";

const UserSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: {
          values: ["user", "admin", "owner"],
        },
        default: "user",
      },
    isbanned: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String,
      },
      passwordResetTokenExpireTime: {
        type: Date,
      },
    homes: [{
        type: Schema.Types.ObjectId,
        ref: "Home"
    }],
    otp: [{
        type: Schema.Types.ObjectId,
        ref: "OTP"
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "like"
    }],
    userActivity    : [{
        type: Schema.Types.ObjectId,
        ref: "ACTIVITY"
    }]
    
}, { versionKey: false, timestamps: true });

const User = model("User", UserSchema);
export default User;
