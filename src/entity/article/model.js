import db from 'components/db';
import QueryBuilder from '../../components/dbExtendsModels/queryBuilder';

class ArticleModel extends QueryBuilder {
  async create ( { title, description, mainText, categoryId = null } = {} ) {
    return await super.create({ title, description, mainText, categoryId });
  }

  update ( _id, { title, description, mainText } = {} ) {
    return super.update( _id, { title, description, mainText } );
  }

}

export default new ArticleModel( db.models.article );