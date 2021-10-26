import ArticleModel from 'entity/article/model';
import ArticleCheck from 'entity/article/validateSchema';
import CategoryCheck from 'entity/category/validateSchema';


class ArticleControl {
  async getById ( { _id } = {} ) {
    await ArticleCheck.existId( _id );
    return ArticleModel.getById( _id );
  }

  async getAll ({ page, limit }) {
    await ArticleCheck.paginate(page, limit);
    const count = await ArticleModel.getCountEntity();
    const entities = await ArticleModel.getAllOfEntity(+page, +limit);
    return {
      entities,
      total: count,
    };
  }

  async getByCategory ( { categoryId, page, limit } = {} ) {
    await CategoryCheck.existId( categoryId );
    await ArticleCheck.paginate(page, limit);
    const count = await ArticleModel.getCountEntityByCategory(categoryId);
    const entities = await ArticleModel.getByCategory(categoryId, +page, +limit);
    return {
      entities,
      total: count,
    };
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
