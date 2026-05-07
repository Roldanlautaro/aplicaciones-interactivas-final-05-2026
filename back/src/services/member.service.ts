import { MemberRepository } from "../repositories/member.repository";
import { Member, MemberStatus } from "../entities/Member";
import { CreateMemberDto, UpdateMemberDto } from "../dtos/member.dto";
import { HttpError } from "../errors/HttpError";

export const MemberService = {
  async create(dto: CreateMemberDto): Promise<Member> {
    const byNumber = await MemberRepository.findOne({ where: { memberNumber: dto.memberNumber } });
    if (byNumber) {
      throw new HttpError(409, `memberNumber ${dto.memberNumber} already exists`);
    }
    const byEmail = await MemberRepository.findOne({ where: { email: dto.email } });
    if (byEmail) {
      throw new HttpError(409, `email ${dto.email} already exists`);
    }

    const member = MemberRepository.create({
      memberNumber: dto.memberNumber,
      name: dto.name,
      email: dto.email,
      status: MemberStatus.ACTIVE,
    });

    return MemberRepository.save(member);
  },

  async findAll(): Promise<Member[]> {
    return MemberRepository.find();
  },

  async findById(id: number): Promise<Member> {
    const member = await MemberRepository.findOne({ where: { id } });
    if (!member) {
      throw new HttpError(404, `Member ${id} not found`);
    }
    return member;
  },

  async update(id: number, dto: UpdateMemberDto): Promise<Member> {
    const member = await this.findById(id);
    if (dto.status !== undefined) {
      member.status = dto.status;
    }
    return MemberRepository.save(member);
  },
};
