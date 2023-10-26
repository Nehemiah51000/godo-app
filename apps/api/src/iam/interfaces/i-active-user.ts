import { StringExpressionOperatorReturningArray } from 'mongoose'
import { ERoles } from '../enums/e-roles.enum'

export interface IActiveUser {
  sub: string

  roles: ERoles

  email: string

  memberId: string
}
