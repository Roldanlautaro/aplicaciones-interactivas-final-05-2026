import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MemberStatus } from "../entities/Member";

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  memberNumber: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

export class UpdateMemberDto {
  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;
}
