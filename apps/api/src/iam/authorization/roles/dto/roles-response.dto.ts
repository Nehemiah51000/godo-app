import { ERoles } from 'src/iam/enums/e-roles.enum'
import { ERoleTypes } from '../enums/e-role-types'
import { Expose, Type } from 'class-transformer'

export class SlimRolesResponseDto {
  @Expose()
  id: string

  @Expose()
  name: string
}

export class RolesResponseDto {
  @Expose()
  id: string

  @Expose()
  name: ERoles

  @Expose()
  description: string

  @Expose()
  isEnabled: boolean

  @Expose()
  @Type(() => SlimRolesResponseDto)
  assignedFor: SlimRolesResponseDto

  @Expose()
  type: ERoleTypes

  @Expose()
  @Type(() => Date)
  createdAt: Date

  @Expose()
  @Type(() => Date)
  updatedAt: Date
}
