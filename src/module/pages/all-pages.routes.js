import { Router } from "express";
import pageController from "./page.controller.js";
import { CheckAuthGuard } from "../../guards/check-auth.guard.js";
import { CheckRolesGuard } from "../../guards/check-role.guard.js";

const pageRoutes = Router();

pageRoutes
  .get("/login", pageController.toLoginPage)
  .get("/create-home", CheckAuthGuard(true), pageController.toCreateHome)
  .get("/settings", CheckAuthGuard(true), pageController.toSettingsUser)
  .get("/support", pageController.toSupport)
  .get("/my-homes/:userId", CheckAuthGuard(true), pageController.toMyHomes)
  .get("/404", pageController.notFoundPage)
  .get("/reset-password", pageController.resetPassword)
  .get("/homes", pageController.toHomes)
  .get("/reset-password/:token", pageController.resetPassword)
  .get("/info-home/:homeId", pageController.infoOneHome)
  .get("/login-otp", CheckAuthGuard(true), pageController.loginOTP)
  .get(
    "/owner",
    CheckAuthGuard(true),
    CheckRolesGuard("owner"),
    pageController.ownerPage
  )
  .get(
    "/owner/users",
    CheckAuthGuard(true),
    CheckRolesGuard("owner"),
    pageController.ownerUsersPage
  )
  .get(
    "/owner/edit-user/:userId",
    CheckAuthGuard(true),
    CheckRolesGuard("owner"),
    pageController.ownerEditUser
  )
  .get("/user-homes/:userId", CheckAuthGuard(true),CheckRolesGuard("owner"), pageController.toUserHomes)
export default pageRoutes;
