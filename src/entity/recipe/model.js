import db from 'components/db';
import QueryBuilder from 'components/queryBuilder';

class RecipeModel extends QueryBuilder {
  create ( { title, description, categoryId = null } = {} ) {
    return super.create( { title, description, categoryId } );
  }

  update ( _id, { title, description } = {} ) {
    return super.update( _id, { title, description } );
  }
}

export default new RecipeModel( db.models.recipe );