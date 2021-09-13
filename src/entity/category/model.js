import db from 'components/db';
import QueryBuilder from 'components/queryBuilder';

class CategoryModel extends QueryBuilder {
  create ( { name, parentCategoryId = null } = {}) {
    return super.create( { name, parentCategoryId } );
  }

  async delete ( _id ) {
    const { parentCategoryId } = await super.getById( _id );
    await this.model.updateMany( { parentCategoryId: _id }, { parentCategoryId } );
    return super.delete(_id);
  }


}

export default new CategoryModel( db.models.category );