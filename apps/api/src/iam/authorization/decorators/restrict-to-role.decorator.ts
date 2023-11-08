import { SetMetadata } from '@nestjs/common'
import { EMembers, EPremiumSubscribers } from 'src/iam/enums/e-roles.enum'

export const RESTRICT_TO_ROLE_KEY = 'RESTRICT_TO_ROLE_KEY'

//a touple is a fixed array. To constraint the contents of the array put the exact values required in the array
export type TRestrictToRoleMemberOnlyTuple = [EMembers, EPremiumSubscribers]

//Map increases the speed of accessing the values in an array
export type TRestrictedToRoleMembersOnly = Map<EMembers, EPremiumSubscribers>

export type TRestrictToRole =
  | TRestrictToRoleMemberOnlyTuple
  | EPremiumSubscribers

export const RestrictToRole = (...roles: TRestrictToRole[]) =>
  SetMetadata(RESTRICT_TO_ROLE_KEY, roles)
