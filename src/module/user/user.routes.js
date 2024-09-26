import { Router } from "express";
import ValidationMiddleware from "../../middleware/validation.middleware.js";
import userController from "./user.controller.js";
import { userCreateValidation, userUpdateValidation } from "./dtos/user.dto.js";
import { CheckAuthGuard } from "../../guards/check-auth.guard.js";
import { CheckRolesGuard } from "../../guards/check-role.guard.js";

const userRoutes = Router();

userRoutes
  .post(
    "/create",
    ValidationMiddleware(userCreateValidation),
    userController.createUser
  )
  .get("/", userController.getAllUsers)
  .get("/:id", userController.getOneUser)
  .delete(
    "/delete/:id",
    CheckAuthGuard(true),
    CheckRolesGuard("owner", "user"),
    userController.deleteUser
  )
  .patch(
    "/update/:id",
    ValidationMiddleware(userUpdateValidation),
    userController.updateUser
  )
  .get(
    "/ban/:id",
    CheckAuthGuard(true),
    CheckRolesGuard("owner"),
    userController.banUser
  )
  .get(
    "/unban/:id",
    CheckAuthGuard(true),
    CheckRolesGuard("owner"),
    userController.unBanUser
  );

export default userRoutes;
