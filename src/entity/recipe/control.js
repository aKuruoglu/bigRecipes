import RecipeModel from 'entity/recipe/model';
import RecipeCheck from 'entity/recipe/validateSchema';

class RecipeControl {
  async recipeCreate ( body = {} ) {
    await RecipeCheck.validateRecipeCreate( body );
    return RecipeModel.createRecipe( body );
  }

  async checkExistRecipe ( id ) {
    await RecipeModel.isExist( id );
  }

}

export default new RecipeControl();
