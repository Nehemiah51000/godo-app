import { EPremiumSubscribers, ERoles } from '../enums/e-roles.enum'

export interface IActiveUser {
  //current user logged into the app
  sub: string

  //gets the role of the user(regular, admin, standard, premium)
  role: ERoles

  email: string

  memberId?: string

  /**
   *  Regardless of who is logged in, the base role MUST always be assigned a value
   * - for account owners baseRole will be equal to role
   * - for members baseRole with be equal to accountOwner role
   */
  baseRole: EPremiumSubscribers

  /**
   * auto generates how many peoplea are in a team everytime a member is created
   * Checks for limits for premium users team users and guest users
   */
  totalTeamMembers: number
}
