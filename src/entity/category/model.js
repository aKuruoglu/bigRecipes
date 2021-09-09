import db from 'components/db';

const model = db.models.category;

class CategoryModel {
  create ({ name, parentCategoryId }) {
    return model.create({ name, parentCategoryId });
  }

  delete ({ id } ) {
    return model.find({ id } ).deleteOne();
  }

  async checkExist ( id ) {
    const isExist = await model.findOne({ _id: id } ).exec();
    return !!isExist;
  }
}

export default new CategoryModel();