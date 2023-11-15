import { Icon } from 'src/features/icons/schema/icon.schema'
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { Project } from '../schema/project.schema'
import { EProjectTypes } from '../enums/e-project-types.enum'
import { EProjectStages } from '../enums/e-projects-stages.enum'
import { EProjectTypeBehavior } from '../enums/e-project-type-behavior.enum'

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  title: string

  @IsOptional()
  @IsEnum(EProjectTypes)
  projectType?: EProjectTypes

  @IsOptional()
  @IsEnum(EProjectTypeBehavior)
  projectTypeBehaviour?: EProjectTypeBehavior

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @Transform(({ value }) => value.trim())
  description?: string

  @IsOptional()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @Transform(({ value }) => value.map((val: string) => val.trim()))
  stages?: Array<EProjectStages | string>

  @IsOptional()
  @IsMongoId()
  iconsId?: Icon

  @IsOptional()
  @IsString()
  progressStage?: EProjectStages | string

  @IsOptional()
  @IsMongoId()
  rootParentId?: Project

  @IsOptional()
  @IsMongoId()
  subParentId?: Project

  @IsOptional()
  @Type(() => Date)
  endAt?: Date

  @IsOptional()
  @Type(() => Date)
  startAt?: Date

  @IsMongoId()
  @IsOptional()
  dependsOn?: Project
}
