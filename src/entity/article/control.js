import ArticleModel from 'entity/article/model';
import ArticleCheck from 'entity/article/validateSchema';

class ArticleControl {
  async getById ( { _id } = {} ) {
    await ArticleCheck.existId( _id );
    return ArticleModel.getById( _id );
  }

  async getByCategory ( { categoryId } = {} ) {
    await ArticleCheck.existCategory( categoryId );
    return ArticleModel.getByCategory( categoryId );
  }

  async add ( body = {} ) {
    const { categoryId } = body;
    await ArticleCheck.existCategory( categoryId );
    await ArticleCheck.create( body );
    return ArticleModel.create( body );
  }

  async remove ( { _id } = {} ) {
    await ArticleCheck.delete( _id );
    return ArticleModel.delete( _id );
  }

  async updateCategory ( body = {} ) {
    const { _id, categoryId } = body;
    await ArticleCheck.existId( _id );
    await ArticleCheck.existCategory( categoryId );
    return ArticleModel.updateCategory( body );
  }

  async update ( body = {} ) {
    await ArticleCheck.update( body );
    return ArticleModel.update( body );
  }

}

export default new ArticleControl();
