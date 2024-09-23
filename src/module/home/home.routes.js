import { Router } from "express";
import homeController from "./home.controller.js";
import { upload } from "../../utils/multer-utils.js";
import ValidationMiddleware from "../../middleware/validation.middleware.js";
import {
  homeCreateValidation,
  homeUpdateValidation,
} from "./dtos/home.validation.dto.js";
import { CheckAuthGuard } from "../../guards/check-auth.guard.js";
import { CheckRolesGuard } from "../../guards/check-role.guard.js";

const homeRoutes = Router();

homeRoutes
  .post(
    "/create",
    upload.array("homeImage"),
    ValidationMiddleware(homeCreateValidation),
    homeController.createHome
  )

  .get("/",homeController.getAllHomes)
  .get("/:id", homeController.getOneHome)
  .delete(
    "/delete/:id",
    CheckAuthGuard(true),
    CheckRolesGuard("owner","admin","user"),
    homeController.deleteHome
  )
  .patch("/update/:id",
    CheckAuthGuard(true),
    CheckRolesGuard("owner","admin","user"), 
    upload.array("homeImage"), homeController.updateHome)
  .get("/topSelling/:homeId",CheckAuthGuard(true),CheckRolesGuard("owner"),homeController.topSellingHome)
  .get("/UnTopSelling/:homeId",CheckAuthGuard(true),CheckRolesGuard("owner"),homeController.UnTopSellingHome)

export default homeRoutes;
