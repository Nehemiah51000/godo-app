import { IsBoolean, IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { User } from '../../schema/user.schema'

export class CreateTeamDto {
  @IsMongoId({ message: 'Invalid User' })
  accountOwner: User

  @IsMongoId()
  mamberId: User

  @IsString()
  @IsNotEmpty()
  description: string

  @IsBoolean()
  isResigned: boolean
}
