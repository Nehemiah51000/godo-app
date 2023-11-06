import { IsBoolean } from 'class-validator'

export class DisableMemberStatusDto {
  @IsBoolean({ message: 'invalid disable option' })
  disabled: boolean
}
