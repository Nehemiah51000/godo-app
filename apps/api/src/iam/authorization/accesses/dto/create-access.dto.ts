import { User } from 'src/iam/users/schema/user.schema'
import { Role } from '../../roles/schema/role.schema'
import { IsMongoId } from 'class-validator'

export class CreateAccessDto {
  @IsMongoId()
  assignedFor: User

  @IsMongoId()
  roleId: Role
  static roleId: any
}
