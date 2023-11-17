import { Expose, Type } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'
import { SlimRolesResponseDto } from 'src/iam/authorization/roles/dto/roles-response.dto'

export class UserResponseDto extends DefaultResponseDto {
  @Expose()
  email: string

  @Expose()
  @Type(() => SlimRolesResponseDto)
  role: SlimRolesResponseDto[]

  @Expose()
  username: string

  @Expose()
  profileImg: string

  @Expose()
  bio?: string

  @Expose()
  totalProjects?: string

  @Expose()
  totalTeamMembers?: string
}

export class SlimUserResponseDto {
  @Expose()
  id: string

  @Expose()
  email: string
}

export class BasicUserInfoResponseDto extends SlimUserResponseDto {
  @Expose()
  profileImg: string
}
