import { Module } from '@nestjs/common'
import { AccessesService } from './accesses.service'
import { AccessesController } from './accesses.controller'
import { UsersModule } from 'src/iam/users/users.module'
import { RolesModule } from '../roles/roles.module'
import { MongooseModule } from '@nestjs/mongoose'
import { Access, accessSchema } from './schema/access.schema'
import { FactoryUtils } from 'src/common/services/factory-utils'

@Module({
  imports: [
    UsersModule,
    RolesModule,
    MongooseModule.forFeatureAsync([
      {
        name: Access.name,
        useFactory: () => {
          const schema = accessSchema

          return schema
        },
      },
    ]),
  ],
  controllers: [AccessesController],
  providers: [AccessesService, FactoryUtils],
  exports: [AccessesService],
})
export class AccessesModule {}
