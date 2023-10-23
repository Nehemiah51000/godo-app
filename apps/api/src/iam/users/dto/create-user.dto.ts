import { IsString, IsOptional, IsNotEmpty } from 'class-validator'
import { Match } from 'src/common/validator/match.validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  @Match('password')
  passwordConfirm: string

  @IsString()
  @IsOptional()
  bio: string

  @IsString()
  @IsOptional()
  profileImg: string
}
