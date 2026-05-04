import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { asyncHandler } from "../middlewares/asyncHandler";

export const reportsRouter = Router();

reportsRouter.get("/activity", asyncHandler(ReportController.activity));
