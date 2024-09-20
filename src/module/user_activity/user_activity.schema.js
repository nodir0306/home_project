import { Schema, model } from "mongoose";

const myActivity = new Schema(
  {
    os: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
  },
  { versionKey: false, timestamps: true, collection: "activity" }
);

const ACTIVITY = model("ACTIVITY", myActivity);
export default ACTIVITY;
