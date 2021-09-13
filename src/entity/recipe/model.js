import db from 'components/db';
import QueryBuilder from 'components/queryBuilder';

class RecipeModel extends QueryBuilder {

  create ( body ) {
    return this.entityCreate( body );
  }

  delete ( _id ) {
    return this.entityDelete( _id );
  }

  getByCategory ( id ) {
    return this.entityGetByCategory( id );
  }

  getById ( _id ) {
    return this.entityGetById( _id );
  }

  updateCategory ( body ) {
    return this.entityUpdateCategory( body );
  }

  update ( body ) {
    const { _id, title, description } = body;
    return this.entityUpdate( _id, { title, description } );
  }

  checkExist ( id ) {
    return this.entityExist( id );
  }
}

export default new RecipeModel( db.models.recipe );