import CategoryCheck from 'entity/category/validateSchema';
import CategoryModel from 'entity/category/model';
import ArticleModel from 'entity/article/model';
import RecipeModel from 'entity/recipe/model';
import CategoryWithCountModel from 'entity/categoryWithCount/model';

class CategoryControl {
  async create ( { name, parentCategoryId = null } = {} ) {
    if (parentCategoryId) {
      await CategoryCheck.existId( parentCategoryId );
    }
    await CategoryCheck.create( { name, parentCategoryId } );
    const category = await CategoryModel.create( { name, parentCategoryId } );
    await CategoryWithCountModel.create( category );
    return category;
  }

  async delete ( { _id } = {} ) {
    await CategoryCheck.existId( _id );
    await RecipeModel.deleteAllByCategoryId( _id );
    await ArticleModel.deleteAllByCategoryId( _id );
    const category = await CategoryModel.delete( _id );
    await CategoryWithCountModel.delete(_id);
    return category;
  }

  async update ( { _id } = {}, { name, parentCategoryId } = {} ) {
    await CategoryCheck.update( { _id, name, parentCategoryId } );
    await CategoryCheck.updateParent( { _id }, { parentCategoryId } );
    const category = await CategoryModel.update( _id, { name, parentCategoryId } );
    await CategoryWithCountModel.update(_id, { name, parentCategoryId } );
    return category;
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
