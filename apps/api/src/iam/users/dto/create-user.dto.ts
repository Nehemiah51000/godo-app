import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsStrongPassword,
} from 'class-validator'
import { Match } from 'src/common/validator/match.validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'User name cannot be more than 50 characters' })
  username: string

  @IsNotEmpty()
  @IsEmail({}, { message: 'This is not a valid email' })
  email: string

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string

  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirm: string

  @IsString()
  @IsOptional()
  bio?: string

  @IsString()
  @IsOptional()
  profileImg?: string
}
