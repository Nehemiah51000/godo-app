import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

/**
 * -get tokens
 * ways to get tokens
 * 1. from bodies where we generate from headers(use temporarily)
 * 2. cookies --> safest way to estract token(used in production apps)
 *
 * create a method attract token
 *
 * verification
 * 1. if user has a token
 *     -if not found throw unauthorized error
 * 2. if the token is valid
 *
 * 3. If token has memberId
 *
 * after validation find this user from the database(find user as subscriber or member)
 * to find a user you need to find their:
 * 1. accesses(what is their role)(if member a person had a memberId use it to look for accesses)
 * 2. totalMembers they have on their team
 *
 *
 * Attach the user to the request
 * details we need
 * 1. ACTIVE_USER_KEY --> active-user-key
 * get the nestjs request
 * req[key]
 * values
 *   -IActiveUser
 *   - memberId if token has memberId
 *
 *
 * baseRole if token has memberId
 *
 *
 *
 *
 *
 */

@Injectable()
export class AccessTokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true
  }
}
