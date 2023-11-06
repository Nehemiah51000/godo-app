import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { AccessesService } from './accesses.service'
import { CreateAccessDto } from './dto/create-access.dto'
import { UpdateAccessDto } from './dto/update-access.dto'
import path from 'path'
import { Role } from '../roles/schema/role.schema'
import { FilterQuery } from 'mongoose'
import { IActiveUser } from 'src/iam/interfaces/i-active-user'
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator'
import { PerseMongoIdPipe } from 'src/common/pipes/perse-mongo-id.pipe'
import { Serialize } from 'src/common/decorators/serialize.decorator'
import { AccessResponseDto } from './dto/access-response.dto'

@Serialize(AccessResponseDto)
@Controller({
  path: 'accesses',
  version: '1',
})
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Post()
  create(
    @Body() createAccessDto: CreateAccessDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.accessesService.create(createAccessDto, activeUser)
  }

  @Get()
  findAll(@ActiveUser() activeUser: IActiveUser, filters?: FilterQuery<Role>) {
    return this.accessesService.findAll(activeUser, filters)
  }

  @Get(':accessId')
  findOne(
    @Param('accessId', PerseMongoIdPipe) accessId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.accessesService.findOne(accessId, activeUser)
  }

  @Patch(':accessId')
  update(
    @Param('accessId') accessId: string,
    @Body() updateAccessDto: UpdateAccessDto,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.accessesService.update(accessId, updateAccessDto, activeUser)
  }

  @Delete(':accessId')
  remove(
    @Param('accessId') accessId: string,
    @ActiveUser() activeUser: IActiveUser,
  ) {
    return this.accessesService.remove(accessId, activeUser)
  }
}
