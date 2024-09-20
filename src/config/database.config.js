import { config } from "dotenv";
config()

export const databaseConfig = {
    url: process.env.DB_PORT + process.env.DB_NAME
}