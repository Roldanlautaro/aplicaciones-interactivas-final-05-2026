import { Request, Response } from "express";
import { MemberService } from "../services/member.service";
import { HttpError } from "../errors/HttpError";

export const MemberController = {
  async create(req: Request, res: Response) {
    const member = await MemberService.create(req.body);
    res.status(201).json(member);
  },

  async list(_req: Request, res: Response) {
    const members = await MemberService.findAll();
    res.json(members);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new HttpError(400, "Invalid id");
    const member = await MemberService.update(id, req.body);
    res.json(member);
  },
};
