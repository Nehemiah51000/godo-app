import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { Role, TRolesDoc } from './schema/role.schema'
import { FilterQuery, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { FactoryUtils } from 'src/common/services/factory-utils'
import { ERoleTypes } from './enums/e-role-types'
import { ToggleRoleDto } from './dto/toggle-role.dto'
import { ERoles } from 'src/iam/enums/e-roles.enum'

@Injectable()
export class RolesService {
  private readonly logger: LoggerService = new Logger(RolesService.name)

  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
    private readonly factoryUtils: FactoryUtils,
  ) {}

  async create(
    createRoleDto: CreateRoleDto,
    activeUser: IActiveUser,
    type: ERoleTypes,
  ) {
    const whoIs = this.factoryUtils.whoIs(activeUser)
    this.logger.log(`The user with id: ${whoIs} is creating a new role`)

    try {
      // data preparation
      const roleDetails = new Role()
      roleDetails.assignedFor = createRoleDto.assignedFor as unknown as Role
      roleDetails.description = createRoleDto.description
      roleDetails.name = createRoleDto?.name

      // hash password

      // create new role
      let newRole = await this.roleModel.create({
        ...roleDetails,
        type,
      })

      return newRole
    } catch (error) {
      // logging errors
      this.logger.warn(`Creating role failed`)
      this.logger.error(error)

      // handle errors
      if (error.name.toLowerCase().includes('validation')) {
        throw new BadRequestException(error.message)
      }

      if (error.code === 11000) {
        throw new ConflictException(
          `Role with ${createRoleDto.name} already in use`,
        )
      }

      throw new InternalServerErrorException('Error creating new role')
    }
  }

  async findAll(
    filters: FilterQuery<Role>,
    activeUser: IActiveUser,
    type: ERoleTypes,
  ) {
    const whoIs = this.factoryUtils.whoIs(activeUser)
    this.logger.log(`User with id: ${whoIs} is accessing all roles`)

    const roles = await this.roleModel
      .find({
        ...filters,
        $and: [{ type }],
      })
      .populate<{ assignedFor: TRolesDoc }>({
        path: 'assignedFor',
        select: 'id name',
      })

    return {
      data: roles,
    }
  }

  async findOne(
    roleId: string,
    activeUser: IActiveUser,
    type: ERoleTypes,
    filters?: FilterQuery<Role>,
  ) {
    const whoIs = this.factoryUtils.whoIs(activeUser)
    this.logger.log(
      `User with id: ${whoIs} is accessing role with id: ${roleId}`,
    )

    return await this.findOneHelper(roleId, filters, type)
  }

  async update(
    roleId: string,
    updateRoleDto: Partial<UpdateRoleDto & ToggleRoleDto>,
    activeUser: IActiveUser,
    type: ERoleTypes,
    filters?: FilterQuery<Role>,
  ) {
    const whoIs = this.factoryUtils.whoIs(activeUser)
    this.logger.log(
      `User with id: ${whoIs} is updating role with id: ${roleId}`,
    )

    // handle updating
    const updatedRole = await this.roleModel.findOneAndUpdate(
      {
        _id: roleId,
        type,
        ...filters,
      },
      updateRoleDto,
      {
        new: true,
      },
    )

    // handle update errors
    this.throwIfRoleNotFound(updatedRole, roleId, 'updating')

    await this.populateHelper(updatedRole)

    // response
    this.logger.log(`Role with id ${roleId} was successfully updated`)

    return updatedRole
  }

  toggle(
    roleId: string,
    toggleRoleDto: ToggleRoleDto,
    activeUser: IActiveUser,
    type: ERoleTypes,
  ) {
    return this.update(roleId, toggleRoleDto, activeUser, type)
  }

  async remove(roleId: string, activeUser: IActiveUser, type: ERoleTypes) {
    const whoIs = this.factoryUtils.whoIs(activeUser)
    this.logger.log(
      `User with id: ${whoIs} is deleting role with id: ${roleId}`,
    )

    // try and delete role
    const deletedRole = await this.roleModel.findOneAndDelete({
      _id: roleId,
      type,
    })

    this.throwIfRoleNotFound(deletedRole, roleId, 'deleting')

    // message
    const message = `Role with ${roleId} was successfully deleted`
    this.logger.log(message)

    return {
      message,
    }
  }

  /**
   * --------------------------------------------------------------
   *
   *                     HELPER METHODS
   *
   * --------------------------------------------------------------
   */

  async findOneHelper(
    searchBy?: ERoles | string,
    filters: FilterQuery<Role> = {},
    type?: ERoleTypes,
  ) {
    const isERole = !!ERoles[searchBy.toUpperCase()]

    const foundRole = await this.roleModel.findOne({
      ...(isERole ? { name: searchBy } : { _id: searchBy, $and: [{ type }] }),
      ...filters,
    })

    //validation
    this.throwIfRoleNotFound(foundRole, searchBy, 'finding')

    //populate fields
    await this.populateHelper(foundRole)

    return foundRole
  }

  private async populateHelper(roleDoc: TRolesDoc) {
    roleDoc = await roleDoc.populate<{ assignedFor: TRolesDoc }>({
      path: 'assignedFor',
      select: 'id name',
    })

    return roleDoc
  }

  private throwIfRoleNotFound(role: Role, roleId: string, action: string) {
    if (!role) {
      this.logger.error(`${action} role with ${roleId} failed`)

      throw new BadRequestException(
        `Oops! looks like  ${action} role with id ${roleId} failed`,
      )
    }
  }
}
