import { IsString } from 'class-validator'

export class CreateAppDto {
  @IsString()
  content: string
}
