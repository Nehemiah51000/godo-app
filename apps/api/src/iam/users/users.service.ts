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
import { Model } from 'mongoose'
import { HashService } from '../authentication/bcrypt/hash.service'

@Injectable()
export class UsersService {
  private readonly logger: LoggerService = new Logger()

  constructor(
    @InjectModel(User.name)
    private readonly useModel: Model<TUserDoc>,

    private readonly hashingService: HashService,
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
      const newUser = await this.useModel.create(userDetails)

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

  async findAll(activeUser: IActiveUser) {
    return `This action returns all users`
  }

  async findOne(userId: string, activeUser: IActiveUser) {
    return `This action returns a #${userId} user`
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
    activeUser: IActiveUser,
  ) {
    return `This action updates a #${userId} user`
  }

  async remove(userId: string, activeUser: IActiveUser) {
    return `This action removes a #${userId} user`
  }
}
