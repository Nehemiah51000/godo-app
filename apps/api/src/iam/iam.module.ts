import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { HashService } from './authentication/bcrypt/hash.service'
import { BcryptService } from './authentication/bcrypt/bcrypt.service'
import { AuthController } from './authentication/auth.controller'
import { FactoryUtils } from 'src/common/services/factory-utils'

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: HashService,
      useClass: BcryptService,
    },
    FactoryUtils,
  ],
  controllers: [AuthController],
})
export class IamModule {}
