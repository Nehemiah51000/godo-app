import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { ERoleTypes } from '../enums/e-role-types'

@Injectable()
export class PerseRoleTypePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!ERoleTypes[value.toLocaleUpperCase()]) {
      throw new BadRequestException(
        `${value} is not a valid type; Expected ${Object.values(
          ERoleTypes,
        ).join(' or ')}`,
      )
    }
    return value
  }
}
