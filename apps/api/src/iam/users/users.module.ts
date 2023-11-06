import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schema/user.schema'
import { HashingService } from '../authentication/bcrypt/hashing.service'
import { BcryptService } from '../authentication/bcrypt/bcrypt.service'
import { FactoryUtils } from 'src/common/services/factory-utils'
import { TeamsController } from './teams/teams.controller'
import { TeamsService } from './teams/teams.service'
import { Team, TeamSchema } from './schema/team.schema'

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
      {
        name: Team.name,
        useFactory: (usersService: UsersService) => {
          const schema = TeamSchema

          schema.statics.calculateTotalMembers = async function (
            accountOwner: string,
          ) {
            //aggrigate number of members
            const stats = await this.aggregate([
              //matching the number of member in the database
              {
                $match: {
                  accountOwner,
                  $and: [{ isActive: true, isResigned: false }],
                },
              },
              //group
              {
                $group: {
                  _id: '$accountOwner',
                  totalSum: { $sum: 1 },
                },
              },
            ])

            //updating user schema

            if (stats.length > 0) {
              usersService.update(accountOwner, {
                totalTeamMembers: stats[0].totalSum,
              })
            }

            //calculate totalTeamMembers after creation of the new document
            schema.post('save', function () {
              // @ts-expect-error - the method is a custom one
              this.constructor.calcTotalTeamMembers(this.accountOwner)
            })

            /// calculate totalTeamMembers after update of document
            schema.post(/^findOneAnd/, function (doc, next) {
              doc.constructor.calcTotalTeamMembers(doc.accountOwner)

              return next()
            })
          }

          return schema
        },
        // inject: [UsersModule],
        // imports: [UsersService],
      },
    ]),
  ],
  controllers: [UsersController, TeamsController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    UsersService,
    TeamsService,
    FactoryUtils,
  ],
  exports: [UsersService, TeamsService],
})
export class UsersModule {}
