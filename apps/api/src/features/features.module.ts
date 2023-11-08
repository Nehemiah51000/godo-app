import { Module } from '@nestjs/common';
import { IconsModule } from './icons/icons.module';
import { CategoriesModule } from './categories/categories.module';
import { TodosModule } from './todos/todos.module';
import { SubTodosModule } from './sub-todos/sub-todos.module';

@Module({
  imports: [IconsModule, CategoriesModule, TodosModule, SubTodosModule]
})
export class FeaturesModule {}
