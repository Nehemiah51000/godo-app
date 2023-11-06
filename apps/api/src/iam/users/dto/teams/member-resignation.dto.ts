import { IsNotEmpty, IsString } from 'class-validator'

export class MemberResignationDto {
  @IsString()
  @IsNotEmpty()
  resignationReason: string
}
