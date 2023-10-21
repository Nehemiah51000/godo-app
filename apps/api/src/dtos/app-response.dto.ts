import { Expose } from 'class-transformer'

export class AppResponseDto {
  @Expose()
  content: string
}
