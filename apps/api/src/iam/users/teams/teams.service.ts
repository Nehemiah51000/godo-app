import {
  BadRequestException,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { CreateTeamDto } from '../dto/teams/create-team.dto'
import { UpdateTeamDto } from '../dto/teams/update-team.dto'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { FilterQuery, Model, PopulateOptions } from 'mongoose'
import { Team } from '../schema/team.schema'
import { InjectModel } from '@nestjs/mongoose'
import { FactoryUtils } from 'src/common/services/factory-utils'
import { UsersService } from '../users.service'
import { EPremiumSubscribers } from 'src/iam/enums/e-roles.enum'
import { DisableMemberStatusDto } from '../dto/teams/disable-member-status.dto'
import { MemberResignationDto } from '../dto/teams/member-resignation.dto'
import { TUserDoc } from '../schema/user.schema'

@Injectable()
export class TeamsService {
  private readonly logger: LoggerService = new Logger(TeamsService.name)
  private readonly MAX_PREMIUM_TEAM = 12
  private readonly MAX_GUEST_TEAM = 3

  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<Team>,

    private readonly factoryUtils: FactoryUtils,

    private readonly usersService: UsersService,
  ) {}

  async create(createTeamDto: CreateTeamDto, activeUser: IActiveUser) {
    const whoIs = this.factoryUtils.whoIs(activeUser)
    const isManager = whoIs === activeUser?.memberId
    const baseRole = activeUser?.baseRole
    const isGuestOrPremiumAccountOwner =
      activeUser.baseRole === EPremiumSubscribers.GUEST_USER ||
      EPremiumSubscribers.PREMIUM_USER

    //checking if the user is admin or a team user to rule them out
    if (
      (isManager && baseRole !== EPremiumSubscribers.ADMIN) ||
      (isManager && baseRole !== EPremiumSubscribers.TEAM_USER) ||
      isGuestOrPremiumAccountOwner
    ) {
      const limit = {
        [EPremiumSubscribers.GUEST_USER]: this.MAX_GUEST_TEAM,
        [EPremiumSubscribers.PREMIUM_USER]: this.MAX_PREMIUM_TEAM,
      }

      //CHECK FOR LIMITS
      if (limit[baseRole] >= activeUser.totalTeamMembers) {
      }
      throw new UnprocessableEntityException(
        'YOu have reached the maximum limit of people you can add to your team',
      )
    }

    let newMember = await this.teamModel.create(createTeamDto)
    newMember = await newMember.populate(this.populateConfigs())

    return newMember
  }

  async findAll(activeUser: IActiveUser, filters: FilterQuery<Team>) {
    //@Todo: implement pagination

    return this.teamModel
      .find({
        ...filters,
        accountOwner: activeUser.sub,
      })
      .populate(this.populateConfigs())
  }

  async findOne(
    teamId: string,
    activeUser: IActiveUser,
    filters: FilterQuery<
      Pick<Team, 'memberId' | 'isActive' | 'isResigned'>
    > = {},
  ) {
    let foundTeam = await this.teamModel.findOne({
      accountOwner: activeUser.sub,
      _id: teamId,
      ...filters,
    })

    if (!foundTeam) {
      const whoIs = this.factoryUtils.whoIs(activeUser)
      this.logger.warn(
        `User with ${whoIs} failed to fetch a team member of id ${teamId} with filters ${JSON.stringify(
          filters,
        )}`,
      )
      throw new NotFoundException('User not found')
    }

    foundTeam = await foundTeam.populate<{
      accountOwner: TUserDoc
      memberId: TUserDoc
    }>(this.populateConfigs())

    return foundTeam
  }

  async update(
    teamId: string,
    updateTeamDto: Partial<
      UpdateTeamDto | DisableMemberStatusDto | MemberResignationDto
    >,
    activeUser: IActiveUser,
    filters: FilterQuery<Team> = {},
  ) {
    let updatedTeamUser = await this.teamModel.findOneAndUpdate(
      {
        accountOwner: activeUser.sub,
        ...filters,
      },
      updateTeamDto,
      {
        new: true,
      },
    )

    if (!updatedTeamUser) {
      const whoIs = this.factoryUtils.whoIs(activeUser)
      this.logger.warn(
        `User with ${whoIs} failed to update a team member of id ${teamId} with filters ${JSON.stringify(
          filters,
        )}`,
      )
      throw new BadRequestException(
        'There was an error updating your information. Please try again',
      )
    }
    //Populate
    updatedTeamUser = await updatedTeamUser.populate(this.populateConfigs())

    return updatedTeamUser
  }
  async disable(
    teamId: string,
    disable: DisableMemberStatusDto,
    activeUser: IActiveUser,
    memberId: string,
  ) {
    return await this.update(teamId, disable, activeUser, {
      memberId,
    })
  }

  async resign(
    teamId: string,
    memberId: string,
    resignDto: MemberResignationDto,
    activeUser: IActiveUser,
  ) {
    return await this.update(teamId, resignDto, activeUser, {
      memberId,
    })
  }
  async remove(teamId: string, activeUser: IActiveUser) {
    const deletedMember = await this.teamModel.findOneAndDelete({
      _id: teamId,
      accountOwner: activeUser.sub,
    })

    if (!deletedMember) {
      throw new BadRequestException(
        `Request to delete a team member failed, make sure the member you are trying to delete is part of the team`,
      )
    }

    return {
      message: `User was successfully deleted`,
    }
  }
  /**
   * -------------------------------------------------------------------
   * HELPER METHODS
   * -------------------------------------------------------------------
   */

  /**
   * Helper methods that return populated fields
   * for account owner and memebrId relations
   * @returns
   *
   */

  private populateConfigs(): PopulateOptions[] {
    return [
      {
        path: 'accountOwner',
        select: 'id email',
      },
      {
        path: 'memberId',
        select: 'id email',
      },
    ]
  }
}
