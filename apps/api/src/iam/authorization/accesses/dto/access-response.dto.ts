import { Expose, Type } from 'class-transformer'
import { SlimUserResponse } from 'src/iam/users/dto/user-response.dto'
import { SlimRolesResponseDto } from '../../roles/dto/roles-response.dto'

export class AccessResponseDto {
  @Expose()
  @Type(() => SlimUserResponse)
  accountOwner: SlimUserResponse

  @Expose()
  @Type(() => SlimUserResponse)
  assignedFor: SlimUserResponse

  @Expose()
  @Type(() => SlimRolesResponseDto)
  roleId: SlimRolesResponseDto
}
