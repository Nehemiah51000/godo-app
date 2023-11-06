import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator'

export class SignInDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'This is not a valid email' })
  email: string

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string
}
