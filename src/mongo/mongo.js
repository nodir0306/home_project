import {mongoose} from "mongoose";
import { databaseConfig } from "../config/database.config.js";

export async function DB() {
    await mongoose.connect(databaseConfig.url)
}
