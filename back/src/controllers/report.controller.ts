import { Request, Response } from "express";
import { ReportService } from "../services/report.service";


// activity: devuelve un resumen de la actividad de la biblioteca, incluyendo:
// - totalBooks: número total de libros en la biblioteca.
// - totalMembers: número total de miembros registrados.
// - activeLoans: número de préstamos activos (no devueltos).
// - overdueLoans: número de préstamos vencidos (no devueltos y con fecha de devolución pasada).
export const ReportController = {
  async activity(_req: Request, res: Response) {
    const report = await ReportService.getActivity();
    res.json(report);
  },
};
