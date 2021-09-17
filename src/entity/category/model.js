import db from 'components/db';
import QueryBuilder from 'components/dbExtendsModels/queryBuilder';
import { Types } from 'mongoose';

class CategoryModel extends QueryBuilder {
  async delete ( _id ) {
    const { parentCategoryId } = await super.getById( _id );
    await this.model.updateMany( { parentCategoryId: _id }, { parentCategoryId } );
    return super.delete( _id );
  }

  getCategory ( _id ) {
    return this.model.aggregate( [
      { $match: { _id: Types.ObjectId( _id ) } },
      {
        $lookup:
          {
            from: 'articles',
            localField: '_id',
            foreignField: 'categoryId',
            pipeline: [
              { $match: { isDeleted: false } },
              { $count: 'count' },
            ],
            as: 'articles',
          },
      },
      { $unwind: '$articles' },
      {
        $lookup:
          {
            from: 'recipes',
            localField: '_id',
            foreignField: 'categoryId',
            pipeline: [
              { $match: { isDeleted: false } },
              { $count: 'count' },
            ],
            as: 'recipes',
          },
      },
      { $unwind: '$recipes' },
      {
        $project: {
          _id: 1,
          name: 1,
          parentCategoryId: 1,
          recipesCount: '$recipes.count',
          articlesCount: '$articles.count',
        },
      },
    ] );

  }
}

export default new CategoryModel( db.models.category );