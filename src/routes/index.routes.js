import { Router } from "express";
import homeRoutes from "../module/home/home.routes.js";
import sendReportRoutes from "../module/reports/reports.routes.js";
import userRoutes from "../module/user/user.routes.js";
import authRoutes from "../module/auth/auth.routes.js";
import likeRoutes from "../module/like/like.routes.js";
import activityRoutes from "../module/user_activity/user_activity.routes.js";

// import likesAndReportsRoutes from "../module/likes&reports/likes&reports.routes.js";

const router = Router();
router
    .use("/auth",authRoutes)
    .use("/homes", homeRoutes)
    .use("/users",userRoutes)
    .use("/reports",sendReportRoutes)
    .use("/like",likeRoutes)
    .use("/activity",activityRoutes)
    // .use("/like-report",likesAndReportsRoutes)
export default router;
