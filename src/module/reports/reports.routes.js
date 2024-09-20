import { Router } from "express";
import {sendReport} from "./reports.controller.js"

const sendReportRoutes = Router();
sendReportRoutes
    .post("/",sendReport)

export default sendReportRoutes;
