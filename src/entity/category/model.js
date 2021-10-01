import db from 'components/db';
import QueryBuilder from 'components/dbExtendsModels/queryBuilder';
import { Types } from 'mongoose';

class CategoryModel extends QueryBuilder {
  async delete ( _id ) {
    const { parentCategoryId } = await super.getById( _id );
    await this.model.updateMany( { parentCategoryId: _id }, { parentCategoryId } );
    return super.delete( _id );
  }

  async getCategory ( _id ) {
    const res = await this.model.aggregate( [
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
      {
        $unwind: {
          path: '$articles',
          preserveNullAndEmptyArrays: true,
        },
      },
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
      { $unwind: { path: '$recipes', preserveNullAndEmptyArrays: true } },
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

    if (!res || !res.length) {
      return null;
    }

    return {
      recipesCount: 0,
      articlesCount: 0,
      ...res[0],
    };
  }
}

export default new CategoryModel( db.models.category );