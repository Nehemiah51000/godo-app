import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RolesSchema } from './schema/role.schema'
import { FactoryUtils } from 'src/common/services/factory-utils'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Role.name,
        useFactory: () => {
          const schema = RolesSchema

          //   schema.pre(/^find/, function (next) {
          //     //@ts-expect-error: Populate is available in this
          //     this.populate<{ assignedFor: Role }>({
          //       path: 'assignedFor',
          //       select: 'id name isValid',
          //     })

          //     return next()
          //   })
          return schema
        },
      },
    ]),
  ],

  controllers: [RolesController],
  providers: [FactoryUtils, RolesService],
  exports: [RolesService],
})
export class RolesModule {}
