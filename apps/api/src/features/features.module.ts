import { Module } from '@nestjs/common'
import { IconsModule } from './icons/icons.module'
import { TodosModule } from './todos/todos.module'
import { SubTodosModule } from './sub-todos/sub-todos.module'
import { ProjectsModule } from './projects/projects.module'

@Module({
  imports: [IconsModule, ProjectsModule, TodosModule, SubTodosModule],
})
export class FeaturesModule {}
