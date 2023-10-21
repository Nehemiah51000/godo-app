import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { Serialize } from './common/decorators/serialize.decorator'
import { AppResponseDto } from './dtos/app-response.dto'
import { PerseMongoIdPipe } from './common/pipes/perse-mongo-id.pipe'
import { CreateAppDto } from './dtos/create-app.dto'

@Serialize(AppResponseDto) //serilizes response data coming from the application
@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() //this is a decorator that handles get requests
  getHello(): string {
    return this.appService.getHello()
  }

  @Post()
  getHelloPost(@Body() content: CreateAppDto) {
    return this.appService.getHolloPost(content)
  }

  /**
   * Is a test
   *
   * @param id ':id' is a dynamic url genarator since we dont know the value.
   * @returns
   *
   * @see
   */
  @Get(':id')
  findOneHello(@Param('id', PerseMongoIdPipe) id: string) {
    return {
      value: `Id: ${id}`,
    }
  }
}
