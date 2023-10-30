import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ERoles } from 'src/iam/enums/e-roles.enum'

export class CreateRoleDto {
  @IsEnum(ERoles)
  @IsNotEmpty()
  @MaxLength(55, {
    message: 'The name should not be longer than 55 characters',
  })
  name: ERoles

  @IsString()
  @IsNotEmpty()
  @MaxLength(500, {
    message: 'Your description should be less than 500 characters',
  })
  description: string

  @IsMongoId()
  @IsOptional()
  assignedFor: string //The parent is the only one who can access this feature
}
