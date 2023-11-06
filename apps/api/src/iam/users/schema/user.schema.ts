import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class User {
  @Prop({
    minlength: [5, 'User name cannot be less than 5 characters'],
    trim: true,
  })
  username: string

  @Prop({
    maxlength: [100, 'Email cannot be more than 50 characters'],
    trim: true,
    unique: true,
  })
  email: string

  @Prop({
    maxlength: [255, 'Password cannot be more than 255 characters'],
    minlength: [6, 'Password cannot be less than 6 characters'],
    trim: true,
  })
  password: string

  // @Prop({
  //   type: String,
  //   validate: {
  //     validator: function (value: string) {
  //       return this.password === value
  //     },
  //     message: 'Passwords do not match',
  //   },
  // })
  // passwordConfirm: string

  @Prop({
    maxlength: [1000, 'Bio cannot be more than 1000 characters'],
    trim: true,
  })
  bio?: string

  @Prop({
    default: true,
  })
  isActive?: boolean

  @Prop({
    default: false,
  })
  isConfirmed?: boolean

  @Prop({
    default: 'default.jpg',
  })
  profileImg: string

  @Prop()
  passwordResetToken?: Date

  @Prop()
  passwordResetExpiresAt?: Date

  @Prop({
    default: '0',
  })
  totalTeamMembers?: number
}
export const UserSchema = SchemaFactory.createForClass(User)

export type TUserDoc = mongoose.HydratedDocument<User>
/*
  username: string
  password: string
  bio: string
  isActive: boolean
  isConfirmed: boolean
  profileImg: string
  passwordResetToken: Date
  passwordResetExpiresAt: Date
 */
