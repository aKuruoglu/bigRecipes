import ArticleModel from 'entity/article/model';
import RecipeModel from 'entity/recipe/model';
import CategoryWithCountModel from 'entity/categoryWithCount/model';

class CategoryWithCountControl {
  create ( category ) {
    return CategoryWithCountModel.create(category);
  }



  async updateCountArticle ( categoryId ) {
    const count = await ArticleModel.getCountEntityByCategory( categoryId );
    await CategoryWithCountModel.update( categoryId, { articlesCount: count });
  }

  async updateCountRecipe ( categoryId ) {
    const count = await RecipeModel.getCountEntityByCategory(categoryId);
    await CategoryWithCountModel.update(categoryId, { recipesCount: count });
  }

  getById ( id ) {
    return CategoryWithCountModel.getById(id);
  }

}

export default new CategoryWithCountControl();