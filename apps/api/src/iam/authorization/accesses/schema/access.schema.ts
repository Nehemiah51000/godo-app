import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../../../users/schema/user.schema'
import { Role } from '../../roles/schema/role.schema'
import { type } from 'os'
import { HydratedDocument } from 'mongoose'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Access {
  @Prop({
    index: User,
  })
  accoutOwner: User

  @Prop({
    index: User,
  })
  assignedFor: User

  @Prop()
  roleId: Role
}

export const accessSchema = SchemaFactory.createForClass(Access)

export type TAccessDoc = HydratedDocument<Access>
