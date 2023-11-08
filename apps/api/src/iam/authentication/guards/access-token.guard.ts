import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AccessesService } from 'src/iam/authorization/accesses/accesses.service'
import { TAccessResponseDoc } from 'src/iam/authorization/accesses/types/t-access-response-doc.type'
import { EPremiumSubscribers } from 'src/iam/enums/e-roles.enum'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { EAuthTypes } from '../enums/e-auth-types.enum'
import { ACTIVE_USER_KEY } from '../constants/active-user.contant'
import { Request } from 'express'

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
  constructor(
    private readonly jwtService: JwtService,

    private readonly accessesService: AccessesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()

    const token = this.extractToken(req)

    if (!token) {
      throw new UnauthorizedException()
    }

    // there is token - verify token
    let payload: Partial<IActiveUser>

    try {
      payload = await this.jwtService.verifyAsync(token)
    } catch (error) {
      throw new UnauthorizedException()
    }

    if (!payload) {
      throw new UnauthorizedException()
    }

    // valid jwt payload - add active user to the request
    await this.addActiveUserToReq(payload, req)

    return true
  }

  /**
   * Fetches
   * @param payload
   * @param req
   */
  private async addActiveUserToReq(
    payload: Partial<IActiveUser>,
    req: Request,
  ) {
    const { sub, memberId } = payload

    const isMember = !!memberId

    let populatedAccessDoc: TAccessResponseDoc

    try {
      populatedAccessDoc = await this.accessesService.findOneHelper(true, {
        accountOwner: sub,
        assignedTo: isMember ? memberId : sub,
      })
    } catch (error) {
      throw new UnauthorizedException()
    }

    // prep active user payload
    const baseRole =
      populatedAccessDoc.baseRole as unknown as EPremiumSubscribers

    const { email, totalTeamMembers } = populatedAccessDoc.accountOwner
    const { name: role } = populatedAccessDoc.roleId

    const reqOptions = {
      sub,
      memberId,
      baseRole,
      email,
      role,
      totalTeamMembers,
    } as IActiveUser

    req[ACTIVE_USER_KEY] = reqOptions
  }

  /**
   * Token extractor from the request object
   * @param context
   * @returns
   */
  extractToken(req: Request) {
    // @TODO: also try to get token from cookies
    const authToken = req.headers?.authorization

    if (!authToken) {
      return false
    }

    const [bearer, token] = authToken.split(' ')

    if (bearer.toLowerCase() !== EAuthTypes.BEARER) {
      return false
    }

    return token
  }
}
