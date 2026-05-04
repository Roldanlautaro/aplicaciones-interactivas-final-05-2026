import { Router } from "express";
import { MemberController } from "../controllers/member.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validateDto } from "../middlewares/validateDto";
import { CreateMemberDto, UpdateMemberDto } from "../dtos/member.dto";

export const membersRouter = Router();

membersRouter.post("/", validateDto(CreateMemberDto), asyncHandler(MemberController.create));
membersRouter.get("/", asyncHandler(MemberController.list));
membersRouter.patch("/:id", validateDto(UpdateMemberDto), asyncHandler(MemberController.update));
