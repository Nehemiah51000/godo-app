import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator'
import { Match } from 'src/common/validator/match.validator'

export class SignUpDto {
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
}
