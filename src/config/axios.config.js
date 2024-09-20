import axios from "../../node_modules/axios/dist/esm/axios.js";
import { config } from "dotenv";
config()
const axiosCustom = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 3000,
});


export default axiosCustom;
