import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { HashingService } from './authentication/bcrypt/hashing.service'
import { BcryptService } from './authentication/bcrypt/bcrypt.service'
import { AuthController } from './authentication/auth.controller'
import { FactoryUtils } from 'src/common/services/factory-utils'
import { RolesModule } from './authorization/roles/roles.module'
import { AccessesModule } from './authorization/accesses/accesses.module';

@Module({
  imports: [UsersModule, RolesModule, AccessesModule],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    FactoryUtils,
  ],
  controllers: [AuthController],
})
export class IamModule {}
