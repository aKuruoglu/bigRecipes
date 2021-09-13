import ArticleModel from 'entity/article/model';
import ArticleCheck from 'entity/article/validateSchema';

class ArticleControl {
  async getById ( { id } = {} ) {
    await ArticleCheck.checkExist( id );
    return ArticleModel.getById( id );
  }

  async getAllByCategory ( { id } = {} ) {
    await ArticleCheck.checkExistCategory( id );
    return ArticleModel.getByCategory( id );
  }

  async add ( body = {} ) {
    const { categoryId } = body;
    await ArticleCheck.checkExistCategory( categoryId );
    await ArticleCheck.checkCreate( body );
    return ArticleModel.create( body );
  }

  async remove ( { id } = {} ) {
    await ArticleCheck.checkDelete( id );
    return ArticleModel.delete( id );
  }

  async updateCategory ( body = {} ) {
    const { id, categoryId } = body;
    await ArticleCheck.checkExist( id );
    await ArticleCheck.checkExistCategory( categoryId );
    return ArticleModel.updateCategory( body );
  }

  async update ( body = {} ) {
    await ArticleCheck.checkUpdate( body );
    return ArticleModel.update( body );
  }

  async checkExistArticle ( id ) {
    return await ArticleModel.checkExist( id );
  }
}

export default new ArticleControl();
