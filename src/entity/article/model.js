import db from 'components/db';
import QueryBuilder from '../../components/queryBuilder';

class ArticleModel extends QueryBuilder {
  getByCategory ( categoryId ) {
    return this.entityGetByCategory( categoryId );
  }

  getById ( _id ) {
    return this.entityGetById( _id );
  }

  create ( body ) {
    return this.entityCreate( body );
  }

  delete ( _id ) {
    return this.entityDelete( _id );
  }

  update ( body ) {
    const { title, description, mainText, _id } = body;
    return this.entityUpdate( _id, { title, description, mainText } );
  }

  updateCategory ( body ) {
    return this.entityUpdateCategory( body );
  }

  checkExist ( id ) {
    return this.entityExist( id );
  }

}

export default new ArticleModel( db.models.article );