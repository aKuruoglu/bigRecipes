import RecipeModel from 'entity/recipe/model';
import RecipeCheck from 'entity/recipe/validateSchema';

class RecipeControl {
  async recipeCreate ( body = {} ) {
    await RecipeCheck.checkCreateBody( body );
    return RecipeModel.create( body );
  }

  async recipeDelete ( { _id } ) {
    await RecipeCheck.checkIsExist( _id );
    return RecipeModel.delete( _id );
  }

  async getAllByCategory ( { categoryId } ) {
    await RecipeCheck.checkExistCategory( categoryId );
    return RecipeModel.getAllByCategory( categoryId );
  }

  async getOneById ( { _id } ) {
    await RecipeCheck.checkIsExist( _id );
    return RecipeModel.getOneById( _id );
  }

  async updateCategory ( body ) {
    const { _id, categoryId } = body;
    await RecipeCheck.checkIsExist( _id );
    await RecipeCheck.checkExistCategory( categoryId );
    return RecipeModel.updateCategory( body );
  }

  async updateRecipe ( body ) {
    await RecipeCheck.checkUpdateRecipe( body );
    return RecipeModel.update( body );
  }

  async checkExistRecipe ( _id ) {
    return await RecipeModel.isExist( _id );
  }

}

export default new RecipeControl();
