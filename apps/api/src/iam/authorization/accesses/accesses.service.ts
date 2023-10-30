import { Injectable, Logger, LoggerService } from '@nestjs/common'
import { CreateAccessDto } from './dto/create-access.dto'
import { UpdateAccessDto } from './dto/update-access.dto'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { FilterQuery, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { RolesService } from '../roles/roles.service'
import { UsersService } from 'src/iam/users/users.service'
import { FactoryUtils } from 'src/common/services/factory-utils'
import { Access } from './schema/access.schema'

@Injectable()
export class AccessesService {
  private readonly logger: LoggerService = new Logger(AccessesService.name)

  constructor(
    @InjectModel(Access.name)
    private readonly accessesModel: Model<Access>,

    private readonly rolesService: RolesService,

    private readonly usersService: UsersService,

    private readonly factoryUtils: FactoryUtils,
  ) {}

  create(createAccessDto: CreateAccessDto, activeUser: IActiveUser) {
    return 'This action adds a new access'
  }

  findAll(activeUser: IActiveUser, filters?: FilterQuery<Access>) {
    return `This action returns all accesses`
  }

  findOne(accessId: string, activeUser: IActiveUser) {
    return `This action returns a #${accessId} access`
  }

  update(
    accessId: string,
    updateAccessDto: UpdateAccessDto,
    activeUser: IActiveUser,
  ) {
    return `This action updates a #${accessId} access`
  }

  remove(accessId: string, activeUser: IActiveUser) {
    return `This action removes a #${accessId} access`
  }
}
