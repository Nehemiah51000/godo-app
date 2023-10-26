import { Injectable } from '@nestjs/common'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'

@Injectable()
export class FactoryUtils {
  /**
   * Returns the real person trying to access this account
   * By default sub is for account owner but if the peson logged in is a member, memberId is set to the current logged user and sub is for the account owner
   * @param activeUser
   * @returns
   */
  whoIs(activeUser: IActiveUser) {
    return activeUser?.memberId ? activeUser.memberId : activeUser
  }
}
