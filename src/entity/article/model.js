import db from 'components/db';
import { cleanData } from 'components/utils';

const model = db.models.article;

class ArticleModel {
  async getByCategory ( id ) {
    const articles = await model.find( { categoryId: id, isDeleted: false } ).lean();
    return articles.map( item => cleanData( item ) );
  }

  async getById ( id ) {
    const article = await model.findOne( { _id: id, isDeleted: false } ).lean();
    return cleanData( article );
  }

  async create ( body ) {
    const article = await model.create( body );
    return cleanData( article.toJSON() );
  }

  async delete ( id ) {
    await model.findOneAndUpdate( { _id: id, isDeleted: false }, { isDeleted: true } );
  }

  async update ( { id, ...body } ) {
    const article = await model.findOneAndUpdate( { _id: id }, { ...body }, { returnOriginal: false } ).lean();
    return cleanData( article );
  }

  async updateCategory ( { id, categoryId } ) {
    const article = await model.findOneAndUpdate( {
      _id: id,
      isDeleted: false,
    }, { categoryId }, { returnOriginal: false } ).lean();
    return cleanData( article );
  }

  async checkExist ( id ) {
    const isExist = await model.findOne( { _id: id, isDeleted: false } ).exec();
    return !!isExist;
  }

}

export default new ArticleModel();