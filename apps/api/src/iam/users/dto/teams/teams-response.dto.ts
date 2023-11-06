import { Expose, Type } from 'class-transformer'
import { User } from '../../schema/user.schema'
import { SlimUserResponseDto } from '../user-response.dto'

export class TeamsResponseDto {
  @Expose()
  @Type(() => SlimUserResponseDto)
  accountOwner: SlimUserResponseDto

  @Expose()
  @Type(() => SlimUserResponseDto)
  mamberId: SlimUserResponseDto

  @Expose()
  description: string

  @Expose()
  isResigned: boolean

  @Expose()
  resignationReason: string

  @Expose()
  isActive: boolean
}

export class SlimTeamsResponseDto {
  @Expose()
  @Type(() => SlimUserResponseDto)
  accountOwner: SlimUserResponseDto

  @Expose()
  @Type(() => SlimUserResponseDto)
  mamberId: SlimUserResponseDto

  @Expose()
  isActive: boolean
}
