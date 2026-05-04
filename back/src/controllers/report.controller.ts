import { Request, Response } from "express";
import { ReportService } from "../services/report.service";

export const ReportController = {
  async activity(_req: Request, res: Response) {
    const report = await ReportService.getActivity();
    res.json(report);
  },
};
