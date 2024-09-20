import { Router } from "express";
import user_activityController from "./user_activity.controller.js";

const activityRoutes = Router()

activityRoutes
    .post("/",user_activityController.createActivity)

export default activityRoutes