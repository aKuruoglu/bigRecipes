import CategoryModel from 'entity/category/model';
import ArticleModel from 'entity/article/model';
import RecipeModel from 'entity/recipe/model';

class CategoryControl {
  create ({ name, parentCategoryId } = {}) {
    return CategoryModel.create({ name, parentCategoryId });
  }

  async delete ( { _id } ) {
    await RecipeModel.deleteAllByCategoryId(_id);
    await ArticleModel.deleteAllByCategoryId(_id);
    return CategoryModel.delete( _id );
  }

  update ( { id, name } ) {
    return CategoryModel.update({ id, name } );
  }

  async checkExistCategory (id) {
    const isExist = await CategoryModel.checkExist(id);
    return !!isExist;
  }
}

export default new CategoryControl();
