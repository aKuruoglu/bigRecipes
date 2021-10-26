import CategoryCheck from 'entity/category/validateSchema';
import CategoryModel from 'entity/category/model';
import ArticleModel from 'entity/article/model';
import RecipeModel from 'entity/recipe/model';

class CategoryControl {
  async create ( { name, parentCategoryId = null } = {} ) {
    if (parentCategoryId) {
      await CategoryCheck.existId( parentCategoryId );
    }
    await CategoryCheck.create( { name, parentCategoryId } );
    return CategoryModel.create( { name, parentCategoryId } );
  }

  async delete ( { _id } = {} ) {
    await CategoryCheck.existId( _id );
    await RecipeModel.deleteAllByCategoryId( _id );
    await ArticleModel.deleteAllByCategoryId( _id );
    return CategoryModel.delete( _id );
  }

  async update ( { _id } = {}, { name, parentCategoryId } = {} ) {
    await CategoryCheck.update( { _id, name, parentCategoryId } );
    await CategoryCheck.updateParent( { _id }, { parentCategoryId } );
    return CategoryModel.update( _id, { name, parentCategoryId } );
  }

  getCategories () {
    return CategoryModel.getAll();
  }

  async getById ( { _id } = {} ) {
    await CategoryCheck.existId( _id );
    return CategoryModel.getCategory( _id );
  }


}

export default new CategoryControl();
