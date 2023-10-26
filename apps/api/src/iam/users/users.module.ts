import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schema/user.schema'
import { HashService } from '../authentication/bcrypt/hash.service'
import { BcryptService } from '../authentication/bcrypt/bcrypt.service'
import { FactoryUtils } from 'src/common/services/factory-utils'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema

          //Hooks
          // schema.pre('save', function (next) {
          //   if (!this.isNew && this.isModified()) return next()

          //   this.password = this.passwordConfirm
          //   this.passwordConfirm = undefined

          //   return next()
          // })

          return schema
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: HashService,
      useClass: BcryptService,
    },
    UsersService,
    FactoryUtils,
  ],
})
export class UsersModule {}
