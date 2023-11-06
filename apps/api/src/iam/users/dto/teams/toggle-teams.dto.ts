import { IsBoolean } from 'class-validator'

export class ToggleTeamsDto {
  @IsBoolean()
  isActive: boolean
}
