import { Injectable, Logger, LoggerService } from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { ToggleProjectStatusDto } from './dto/toggle-project-status.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Project } from './schema/project.schema'
import { Model } from 'mongoose'

@Injectable()
export class ProjectsService {
  private readonly MAX_STANDARD_SUBSCRIBER_PROJECTS = 12
  private readonly MAX_GUEST_SUBSCRIBER_PROJECTS = 3

  private readonly logger: LoggerService = new Logger(ProjectsService.name)

  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {}

  create(createProjectDto: CreateProjectDto) {
    return 'This action adds a new Project'
  }

  findAll() {
    return `This action returns all Projects`
  }

  findOne(ProjectId: string) {
    return `This action returns a #${ProjectId} Project`
  }

  update(
    ProjectId: string,
    updateProjectDto: Partial<UpdateProjectDto | ToggleProjectStatusDto>,
  ) {
    return `This action updates a #${ProjectId} Project`
  }

  toggleStatus(ProjectId: string, toggleStatusDto: ToggleProjectStatusDto) {
    return `toggleStatus`
  }

  remove(ProjectId: string) {
    return `This action removes a #${ProjectId} Project`
  }
}
