import CategoryModel from 'entity/category/model';

class CategoryControl {
  create ({ name = '', parentCategoryId } = {}) {
    return CategoryModel.create({ name, parentCategoryId });
  }

  delete ( { id } ) {
    return CategoryModel.delete({ id } );
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
