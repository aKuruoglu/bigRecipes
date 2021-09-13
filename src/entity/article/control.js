import ArticleModel from 'entity/article/model';
import ArticleCheck from 'entity/article/validateSchema';
import CategoryCheck from 'entity/category/validateSchema';

class ArticleControl {
  async getById ( { _id } = {} ) {
    await ArticleCheck.existId( _id );
    return ArticleModel.getById( _id );
  }

  async getByCategory ( { categoryId } = {} ) {
    await CategoryCheck.existId( categoryId );
    return ArticleModel.getByCategory( categoryId );
  }

  async add ( body = {} ) {
    const { categoryId } = body;
    await CategoryCheck.existId( categoryId );
    await ArticleCheck.create( body );
    return ArticleModel.create( body );
  }

  async remove ( { _id } = {} ) {
    await ArticleCheck.existId( _id );
    return ArticleModel.delete( _id );
  }

  async updateCategory ( { _id, categoryId } = {} ) {
    await ArticleCheck.existId( _id );
    await CategoryCheck.existId( categoryId );
    return ArticleModel.updateCategory( { _id, categoryId } );
  }

  async update ( { _id } = {}, body = {} ) {
    await ArticleCheck.update( { _id, ...body } );
    return ArticleModel.update(_id, body );
  }

}

export default new ArticleControl();
