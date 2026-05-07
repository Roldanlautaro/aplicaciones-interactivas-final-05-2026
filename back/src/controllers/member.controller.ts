import { Request, Response } from "express";
import { MemberService } from "../services/member.service";
import { HttpError } from "../errors/HttpError";

// create: recibe un JSON con los datos del miembro (sin id) y devuelve el miembro creado con su id asignado.
// list: devuelve un array con todos los miembros.
// update: recibe un id por params y un JSON con los datos a actualizar (name, email, membershipDate) y devuelve el miembro actualizado.
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
