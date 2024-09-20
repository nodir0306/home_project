import { Router } from "express";
import likeController from "./like.controller.js";

const likeRoutes = Router();

likeRoutes
    .post("/",likeController.createLike)
export default likeRoutes;
