import { Schema, model } from "mongoose";

const homeSchema = new Schema(
  {
    area: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isBoys: {
      type: Boolean,
      required: true,
    },
    roomsCount: {
      type: Number,
    },
    bathRoomsCount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["onSale", "soldOut", "rejected"],
      },
    },
    isWifi: {
      type: Boolean,
      default: false,
    },
    additionalInformation: {
      type: String,
      default: "",
    },
    sellerPhoneNumber: {
      type: String,
      required: true,
    },
    isConditioner: {
      type: Boolean,
      default: false,
    },
    isOwnerHouse: {
      type: Boolean,
      required: true,
    },
    city: {
      type: String,
      enum: {
        values: [
          "tashkent",
          "samarkand",
          "bukhara",
          "khiva",
          "andijan",
          "fergana",
          "namangan",
          "nukus",
          "urgench",
          "qarshi",
          "jizzakh",
          "gulistan",
          "kokand",
        ],
      },
    },

    likes: [{
      type: Schema.Types.ObjectId,
      ref: "like"
  }],
    homeImage: {
      type: [String],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { versionKey: false, timestamps: true}
);

const Home = model("Home", homeSchema);
export default Home;
