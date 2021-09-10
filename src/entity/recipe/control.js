import RecipeModel from 'entity/recipe/model';
import RecipeCheck from 'entity/recipe/validateSchema';

class RecipeControl {
  async recipeCreate ( body = {} ) {
    await RecipeCheck.checkCreateBody( body );
    return RecipeModel.create( body );
  }

  async recipeDelete ( { recipeId } ) {
    await RecipeCheck.checkIsExist( recipeId );
    return RecipeModel.delete( recipeId );
  }

  async getAllByCategory ( { categoryId } ) {
    await RecipeCheck.checkExistCategory( categoryId );
    return RecipeModel.getAllByCategory( categoryId );
  }

  async getOneById ( { recipeId } ) {
    await RecipeCheck.checkIsExist( recipeId );
    return RecipeModel.getOneById( recipeId );
  }

  async updateCategory ( { categoryId, recipeId } ) {
    await RecipeCheck.checkIsExist( recipeId );
    await RecipeCheck.checkExistCategory( categoryId );
    return RecipeModel.updateCategory( categoryId, recipeId );
  }

  async updateRecipe ( body ) {
    await RecipeCheck.checkUpdateRecipe( body );
    return RecipeModel.update( body );
  }

  async checkExistRecipe ( id ) {
    return await RecipeModel.isExist( id );
  }

}

export default new RecipeControl();
