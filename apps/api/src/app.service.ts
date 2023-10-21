import { Injectable } from '@nestjs/common'
import { CreateAppDto } from './dtos/create-app.dto'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }

  getHolloPost(content: CreateAppDto) {
    return {
      data: content,
    }
  }
}
