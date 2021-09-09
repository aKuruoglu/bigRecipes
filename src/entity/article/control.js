import ArticleModel from 'entity/article/model';
import ArticleCheck from 'entity/article/validateSchema';

class ArticleControl {
  async getAllArticleByCategory ( { categoryId } = {}) {
    await ArticleCheck.checkExistCategory( categoryId );
    return ArticleModel.getAllByCategory( categoryId );
  }

  async getArticleById ({ articleId } = {}) {
    await ArticleCheck.checkExistArticle(articleId);
    return ArticleModel.getById( articleId );
  }

  async articleCreate ( body = {}) {
    await ArticleCheck.checkCreateArticle(body);
    return ArticleModel.createArticle( body );
  }

  async articleDelete ({ articleId } = {}) {
    await ArticleCheck.checkDeleteArticle( articleId );
    return ArticleModel.deleteArticle( articleId );
  }

  async updateCategory ( body = {}) {
    await ArticleCheck.checkUpdateArticleCategory( body );
    return ArticleModel.updateCategory( body );
  }

  async updateArticle ( body = {}) {
    await ArticleCheck.checkUpdateArticle(body);
    return ArticleModel.updateArticle( body );
  }

  async checkExistArticle (id) {
    return await ArticleModel.checkExist(id);
  }
}

export default new ArticleControl();
