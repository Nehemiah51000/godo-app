import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from './user.schema'
import { HydratedDocument, SchemaTypes } from 'mongoose'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class Team {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'user',
    index: true,
    maxlength: [40, 'The characters can only be 40'],
    trim: true,
  })
  accountOwner: User

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'user',
    index: true,
  })
  memberId: User

  @Prop({
    maxlength: [
      255,
      'The description can only have a maximum of 255 characters',
    ],
  })
  description: string

  @Prop({
    default: false,
    index: true,
  })
  isResigned: boolean

  @Prop({
    maxlength: [
      500,
      'The description can only have a maximum of 255 characters',
    ],
  })
  resignationReason: string

  @Prop({
    default: true,
    index: true,
  })
  isActive: boolean
}
export const TeamSchema = SchemaFactory.createForClass(Team)
export type TTeamDoc = HydratedDocument<Team>
