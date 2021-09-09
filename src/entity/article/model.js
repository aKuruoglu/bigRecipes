import db from 'components/db';
import { cleanData } from 'components/utils';

const model = db.models.article;

class ArticleModel {
  async getAllByCategory ( categoryId ) {
    const articles = await model.find( { categoryId, isDeleted: false } ).lean();
    return articles.map(item => cleanData(item));
  }

  async getById ( articleId ) {
    const article = await model.findOne({ _id: articleId }).lean();
    return cleanData( article );
  }

  createArticle ( body ) {
    return model.create( body );
  }

  async deleteArticle ( articleId ) {
    await model.findOneAndUpdate({ _id: articleId }, { isDeleted: true }  );
  }

  async updateArticle ( { articleId, ...body }  ) {
    const article = await model.findOneAndUpdate({ _id: articleId }, body  ).lean();
    return cleanData( article );
  }

  async updateCategory ({ articleId, categoryId }) {
    await model.findOneAndUpdate({ _id: articleId }, { categoryId }).exec();
  }

  async checkExist ( id  ) {
    const isExist = await model.findOne({ _id: id } ).exec();
    return !!isExist;
  }

}

export default new ArticleModel();