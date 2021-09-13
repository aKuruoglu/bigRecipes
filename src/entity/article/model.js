import db from 'components/db';
import QueryBuilder from '../../components/queryBuilder';

class ArticleModel extends QueryBuilder {
  create ( { title, description, mainText, categoryId = null } = {} ) {
    return super.create( { title, description, mainText, categoryId } );
  }

  update ( _id, { title, description, mainText } = {} ) {
    return super.update( _id, { title, description, mainText } );
  }

}

export default new ArticleModel( db.models.article );