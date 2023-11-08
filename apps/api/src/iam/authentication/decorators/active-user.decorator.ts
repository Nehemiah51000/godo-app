import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { ACTIVE_USER_KEY } from '../constants/active-user.contant'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'

export const ActiveUser = createParamDecorator(
  (_: any, ctx: ExecutionContext): IActiveUser => {
    const req = ctx.switchToHttp().getRequest()

    const activeUserDetails = req[ACTIVE_USER_KEY]

    return activeUserDetails
  },
)
