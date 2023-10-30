import {
  Injectable,
  LoggerService,
  Logger,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { IActiveUser } from '../interfaces/i-active-user'
import { TUserDoc, User } from './schema/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { HashingService } from '../authentication/bcrypt/hashing.service'
import { ERoles } from '../enums/e-roles.enum'
import { FactoryUtils } from 'src/common/services/factory-utils'

@Injectable()
export class UsersService {
  private readonly logger: LoggerService = new Logger()

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
    const isAdmin = activeUser.roles.includes('admin')
    const foundUser = await this.userModel.findOne({
      _id: userId,
      ...(isAdmin ? {} : { username: activeUser.sub }),
      ...filters,
    })

    this.throwIfUserNotFound(foundUser, userId, activeUser, filters)
    return foundUser
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
    activeUser: IActiveUser,
    filters?: FilterQuery<User>,
  ) {
    const isAdmin = activeUser.roles.includes('admin')

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

    // //know user role

    // //handles admin deleting a user
    // const isAdmin = userRole.includes('admin')

    // //account owner deleting a user
    // const isAccountOwner =
    //   activeUser.roles.includes('owner') || userRole === ERoles.ADMIN

    // //handles account manager deleting a user
    // const isAccountManager = userRole.includes('manager')

    // //Team  member deleting a user
    // const isTeamMember =
    //   userRole.includes('member') || userRole === ERoles.ADMIN_ASSISTANT

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

    return `This action removes a #${userId} user`
  }

  /**
   * ------------------------------------------------------------------------------------
   * 
   * ..........................Helper section

   --------------------------------------------------------------------------------------
   */

  private throwIfUserNotFound(
    foundUser: import('mongoose').Document<
      unknown,
      {},
      import('mongoose').Document<unknown, {}, User> &
        User & { _id: import('mongoose').Types.ObjectId }
    > &
      import('mongoose').Document<unknown, {}, User> &
      User & { _id: import('mongoose').Types.ObjectId } & Required<{
        _id: import('mongoose').Types.ObjectId //   ...filters,
      }>,
    userId: string,
    activeUser: IActiveUser,
    filters: FilterQuery<User>,
  ) {
    if (!foundUser) {
      this.logger.error(
        `Failed to fetch user with ${userId} for user  ${
          activeUser?.memberId || activeUser.sub
        } with filters ${filters}`,
      )

      throw new BadRequestException('User was not found')
    }
  }
}
