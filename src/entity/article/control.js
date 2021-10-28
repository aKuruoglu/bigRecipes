import ArticleModel from 'entity/article/model';
import ArticleCheck from 'entity/article/validateSchema';
import CategoryCheck from 'entity/category/validateSchema';
import CategoryWithCounts from 'entity/categoryWithCount/control';


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
    const article = await ArticleModel.create( body );
    await CategoryWithCounts.updateCountArticle(categoryId);
    return article;
  }

  async remove ( { _id } = {} ) {
    await ArticleCheck.existId( _id );
    const article = await ArticleModel.delete( _id );
    await CategoryWithCounts.updateCountArticle(article.categoryId);
    return article;
  }

  async updateCategory ( { _id, categoryId } = {} ) {
    await ArticleCheck.existId( _id );
    await CategoryCheck.existId( categoryId );
    const oldArticle = await ArticleModel.getById(_id);
    const article = await ArticleModel.updateCategory( { _id, categoryId } );
    await CategoryWithCounts.updateCountArticle(oldArticle.categoryId);
    await CategoryWithCounts.updateCountArticle(article.categoryId);
    return article;
  }

  async update ( { _id } = {}, body = {} ) {
    await ArticleCheck.update( { _id, ...body } );
    return ArticleModel.update(_id, body );
  }

}

export default new ArticleControl();
