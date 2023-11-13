import { Test, TestingModule } from '@nestjs/testing'
import { projectsService } from './projects.service'

describe('projectsService', () => {
  let service: projectsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [projectsService],
    }).compile()

    service = module.get<projectsService>(projectsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
