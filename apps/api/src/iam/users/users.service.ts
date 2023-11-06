import {
  Injectable,
  LoggerService,
  Logger,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { IActiveUser } from '../interfaces/i-active-user'
import { TUserDoc, User } from './schema/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { HashingService } from '../authentication/bcrypt/hashing.service'
import { FactoryUtils } from 'src/common/services/factory-utils'
import { EPremiumSubscribers } from '../enums/e-roles.enum'

@Injectable()
export class UsersService {
  private readonly logger: LoggerService = new Logger(UsersService.name)

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<TUserDoc>,

    private readonly hashingService: HashingService,
    private readonly factoryUtils: FactoryUtils,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const userDetails = new User()

      //data preparation
      userDetails.username = createUserDto.username
      userDetails.email = createUserDto.email
      userDetails.bio = createUserDto?.bio
      userDetails.profileImg = createUserDto?.profileImg

      //@ToDO hash password
      userDetails.password = await this.hashingService.hash(
        createUserDto.password,
      )

      //create new user
      const newUser = await this.userModel.create(userDetails)

      //@ToDo sign token--not applicable here

      //@ToDo send email to created user to invite them
      return newUser
    } catch (error) {
      //loggin error
      this.logger.warn('creating user failed')
      this.logger.error(error)

      //handle errors
      if (error.name.toLowerCase().includes('validation')) {
        throw new BadRequestException(error.message)
      }

      if (error.code === 11000) {
        throw new ConflictException('Email already in use')
      }

      throw new InternalServerErrorException('Error creating new user')
    }
  }

  async findAll(filters: FilterQuery<Partial<User>>, activeUser: IActiveUser) {
    return this.userModel.find()
  }

  async findOne(
    userId: string,
    activeUser: IActiveUser,
    filters?: FilterQuery<User>,
  ) {
    const isAdmin = activeUser.role.includes('admin')

    const foundUser = await this.findOneHelper(
      'id',
      {
        ...filters,
        ...(isAdmin ? {} : { username: activeUser.sub }),
      },
      userId,
    )

    return foundUser
  }

  async update(
    userId: string,
    updateUserDto: Partial<UpdateUserDto | { totalTeamMembers: number }>,
    activeUser?: IActiveUser,
    filters?: FilterQuery<User>,
  ) {
    const isAdmin = activeUser.role.includes('admin')

    //Prevents users from updating other fields
    this.throwIfUpdatingOtherUsers(activeUser, userId)

    //handle updating
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        ...(isAdmin ? {} : { username: activeUser.sub }),
        ...filters,
      },
      updateUserDto,
      {
        new: true,
      },
    )

    //handle updating error
    if (!updatedUser) {
      this.logger.error(
        `Failed to update user with ${userId}  for user  ${
          activeUser?.memberId || activeUser.sub
        } with filters ${filters}`,
      )

      throw new BadRequestException('User was not found')
    }
    this.logger.log(`User with id ${userId} was successfully updated.`)
    return updatedUser
  }

  async remove(
    userId: string,
    activeUser: IActiveUser,
    filters?: FilterQuery<User>,
  ) {
    const whoIs = this.factoryUtils.whoIs(activeUser)

    // const userRole = activeUser.roles

    //find the user about to be deleted
    const userToBeDeleted = this.findOne(userId, activeUser)
    if ((await userToBeDeleted).id === activeUser.sub) {
      throw new BadRequestException('You cannot delete an account owner')
    }

    // //know user roles

    // //handles admin deleting a user
    // const isAdmin = userRole.includes('admin')

    // //account owner deleting a user
    // const isAccountOwner =
    //   activeUser.roles.includes('owner') || userRole === ERole.ADMIN

    // //handles account manager deleting a user
    // const isAccountManager = userRole.includes('manager')

    // //Team  member deleting a user
    // const isTeamMember =
    //   userRole.includes('member') || userRole === ERole.ADMIN_ASSISTANT

    // if (isTeamMember) {
    //   throw new BadRequestException('User access denied')
    // }
    // const deletedUser = await this.userModel.findOneAndDelete({
    //   _id: userId,
    //   ...(isAdmin ? {} : { username: activeUser.sub }),
    //   ...filters,
    // })

    //user must not delete themselves
    if (userId === whoIs) {
      throw new BadRequestException('You cannot delete yourself')
    }

    //try and delete
    const deletedUser = await this.userModel.findOneAndDelete({
      _id: userId,
    })

    this.throwIfUserNotFound(deletedUser, userId, 'deleting')

    //message
    const message = `User with id ${userId} was succesfully deleted`
    this.logger.log(message)

    return {
      message,
    }
  }

  /**
   * ------------------------------------------------------------------------------------
   * 
   * ..........................Helper section

   --------------------------------------------------------------------------------------
   */

  async findOneHelper(
    type: 'custom' | 'id' = 'id',
    filters: FilterQuery<User> = {},
    searchBy?: string,
  ) {
    const foundUser = await this.userModel.findOne({
      ...(type === 'custom' ? filters : { _id: searchBy }),
      ...filters,
    })

    // validation
    this.throwIfUserNotFound(foundUser, searchBy, 'finding')

    return foundUser
  }

  async removeHelper(userId: string) {
    return await this.userModel.deleteOne({ _id: userId })
  }
  private throwIfUserNotFound(user: User, userId: string, action: string) {
    if (!user) {
      this.logger.error(`${action} user with ${userId} failed`)

      throw new BadRequestException(
        `Oops! looks like  ${action} user with id ${userId} failed`,
      )
    }
  }

  /**
   * Prevents user from updating other users fields
   * @param activeUser
   * @param userId
   */
  private throwIfUpdatingOtherUsers(activeUser: IActiveUser, userId: string) {
    if (
      activeUser &&
      activeUser.sub !== userId &&
      activeUser.baseRole !== EPremiumSubscribers.ADMIN
    ) {
      throw new ForbiddenException('Update not allowed')
    }
  }
}
