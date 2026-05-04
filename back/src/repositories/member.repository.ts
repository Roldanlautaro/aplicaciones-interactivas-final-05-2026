import { AppDataSource } from "../config/data-source";
import { Member } from "../entities/Member";

export const MemberRepository = AppDataSource.getRepository(Member);
