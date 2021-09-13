import RecipeModel from 'entity/recipe/model';
import RecipeCheck from 'entity/recipe/validateSchema';

class RecipeControl {
  async create ( body = {} ) {
    await RecipeCheck.create( body );
    return RecipeModel.create( body );
  }

  async delete ( { _id } ) {
    await RecipeCheck.existId( _id );
    return RecipeModel.delete( _id );
  }

  async getByCategory ( { categoryId } ) {
    await RecipeCheck.existCategoryId( categoryId );
    return RecipeModel.getByCategory( categoryId );
  }

  async getById ( { _id } ) {
    await RecipeCheck.existId( _id );
    return RecipeModel.getById( _id );
  }

  async updateCategory ( body ) {
    const { _id, categoryId } = body;
    await RecipeCheck.existId( _id );
    await RecipeCheck.existCategoryId( categoryId );
    return RecipeModel.update( body );
  }

  async update ( body ) {
    await RecipeCheck.update( body );
    return RecipeModel.update( body );
  }

}

export default new RecipeControl();
