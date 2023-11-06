import { Expose, Type } from 'class-transformer'
import {
  BasicUserInfoResponseDto,
  SlimUserResponseDto,
} from 'src/iam/users/dto/user-response.dto'
import { SlimRolesResponseDto } from '../../roles/dto/roles-response.dto'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'

export class AccessResponseDto extends DefaultResponseDto {
  @Expose()
  @Type(() => SlimUserResponseDto)
  accountOwner: SlimUserResponseDto

  @Expose()
  @Type(() => SlimUserResponseDto)
  assignedTo: SlimUserResponseDto

  @Expose()
  @Type(() => SlimRolesResponseDto)
  roleId: SlimRolesResponseDto
}

export class AccessFullResponseDto extends DefaultResponseDto {
  @Expose()
  @Type(() => BasicUserInfoResponseDto)
  accountOwner: BasicUserInfoResponseDto

  @Expose()
  @Type(() => BasicUserInfoResponseDto)
  assignedTo: BasicUserInfoResponseDto
}
