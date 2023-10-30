import { Expose, Type } from 'class-transformer'
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto'
import { SlimRolesResponseDto } from 'src/iam/authorization/roles/dto/roles-response.dto'

export class UserResponseDto extends DefaultResponseDto {
  @Expose()
  username: string

  @Expose()
  email: string

  @Expose()
  @Type(() => SlimRolesResponseDto)
  role: SlimRolesResponseDto

  @Expose()
  profileImg: string

  @Expose()
  bio?: string
}

export class SlimUserResponse {
  @Expose()
  id: string

  @Expose()
  email: string
}
