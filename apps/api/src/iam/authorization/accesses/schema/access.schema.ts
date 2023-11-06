import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../../../users/schema/user.schema'
import { Role } from '../../roles/schema/role.schema'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { EPremiumSubscribers } from 'src/iam/enums/e-roles.enum'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Access {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
  })
  accoutOwner: User

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
  })
  assignedTo: User

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Role',
  })
  roleId: Role

  @Prop({
    default: true,
    index: true,
  })
  isEnabled: boolean

  @Prop({
    type: String,
    enum: {
      values: [...Object.values(EPremiumSubscribers)],
      message: `Invalid role {VALUE}, expects ${Object.values(
        EPremiumSubscribers,
      ).join(' or ')}`,
    },
  })
  baseRole: EPremiumSubscribers
}

export const accessSchema = SchemaFactory.createForClass(Access)

export type TAccessDoc = HydratedDocument<Access>
