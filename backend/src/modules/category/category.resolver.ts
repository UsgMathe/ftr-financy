import { User } from '@/generated/prisma/client';
import { GqlUser } from '@/graphql/decorators/user.decorator';
import { IsAuth } from '@/shared/middlewares/is-auth.middleware';
import { Arg, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { PaginatedCategoriesModel } from './models/paginated-categories.model';
import { CategoryService } from './category.service';
import { CategoryModel } from './models/category.model';
import { CreateCategoryInput } from './dtos/create-category.dto';
import { UpdateCategoryInput } from './dtos/update-category.dto';

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private readonly categoryService = new CategoryService();

  @Mutation(() => CategoryModel, { description: 'Criar uma categoria' })
  async createCategory(
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: User,
  ) {
    return this.categoryService.createCategory(user.id, data);
  }

  @Mutation(() => CategoryModel, { description: 'Atualizar uma categoria' })
  async updateCategory(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
    @GqlUser() user: User,
  ) {
    return this.categoryService.updateCategory(user.id, id, data);
  }

  @Mutation(() => Boolean, { description: 'Deletar uma categoria' })
  async deleteCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: User,
  ) {
    return this.categoryService.deleteCategory(user.id, id);
  }

  @Query(() => CategoryModel, { description: 'Buscar uma categoria' })
  async getCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: User,
  ) {
    return this.categoryService.findCategory(user.id, id);
  }

  @Query(() => PaginatedCategoriesModel, { description: 'Listar as categorias' })
  async listCategories(
    @GqlUser() user: User,
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number,
  ) {
    return this.categoryService.listCategories(user.id, page, limit);
  }
}
