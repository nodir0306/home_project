import { Router } from "express";
import likeController from "./like.controller.js";
import { CheckAuthGuard } from "../../guards/check-auth.guard.js";

const likeRoutes = Router();

likeRoutes
    
    .post("/addlike",likeController.createLike)
    .post("/unlike",likeController.unlike)
export default likeRoutes;
