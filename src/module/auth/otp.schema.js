import { Schema,model } from "mongoose";
const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    verifyText: {
        type: String,
        required: true,
    },
    expire_at: {
        type: Date,
        default: Date.now(),
        expires: 120,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
},
{
    collection: "otp",
    timestamps: true,
});

const OTP = model("OTP", otpSchema);
export default OTP;