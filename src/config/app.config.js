import { config } from "dotenv";
config()

export const appConfig = {
    port: process.env.APP_PORT,
    host: process.env.APP_HOST
}
