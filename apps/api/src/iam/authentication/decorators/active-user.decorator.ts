import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { REQ_ACTIVE_USER } from '../constants/active-user.contant'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'

export const ActiveUser = createParamDecorator(
  (_: any, ctx: ExecutionContext): IActiveUser => {
    const req = ctx.switchToHttp().getRequest()

    const activeUserDetails = req[REQ_ACTIVE_USER]

    return activeUserDetails
  },
)
