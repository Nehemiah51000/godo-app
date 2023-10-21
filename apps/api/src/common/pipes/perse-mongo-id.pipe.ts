import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'

import mongoose from 'mongoose'

@Injectable()
export class PerseMongoIdPipe implements PipeTransform {
  transform(value: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(value)

    if (!isValidId) {
      throw new BadRequestException('Invalid Id format')
    }

    return value
  }
}
