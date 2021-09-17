import RecipeModel from 'entity/recipe/model';
import RecipeCheck from 'entity/recipe/validateSchema';
import CategoryCheck from 'entity/category/validateSchema';

class RecipeControl {
  async create ( body = {} ) {
    const { categoryId } = body;
    await CategoryCheck.existId( categoryId );
    await RecipeCheck.create( body );
    return RecipeModel.create( body );
  }

  async delete ( { _id } ) {
    await RecipeCheck.existId( _id );
    return RecipeModel.delete( _id );
  }

  async getByCategory ( { categoryId } ) {
    await CategoryCheck.existId( categoryId );
    return RecipeModel.getByCategory( categoryId );
  }

  async getById ( { _id } ) {
    await RecipeCheck.existId( _id );
    return RecipeModel.getById( _id );
  }

  async updateCategory ( { _id, categoryId } = {} ) {
    await RecipeCheck.existId( _id );
    await CategoryCheck.existId( categoryId );
    return RecipeModel.updateCategory( { _id, categoryId } );
  }

  async update ( _id, body ) {
    await RecipeCheck.update( { _id, ...body } );
    return RecipeModel.update( _id, body );
  }

}

export default new RecipeControl();
