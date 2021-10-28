import db from 'components/db';
import QueryBuilder from 'components/dbExtendsModels/queryBuilder';

class CategoryWithCountModel extends QueryBuilder {
  create ( category ) {
    const { _id, name, parentCategoryId } = category;
    return super.create( { _id, name, parentCategoryId } );
  }

  async delete (_id) {
    const { parentCategoryId } = await super.getById( _id );
    await this.model.updateMany( { parentCategoryId: _id }, { parentCategoryId } );
    return super.delete(_id);
  }
}


export default new CategoryWithCountModel(db.models.categoryWithCount);