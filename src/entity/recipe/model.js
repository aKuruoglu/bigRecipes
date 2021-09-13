import db from 'components/db';
import { cleanData } from 'components/utils';

const model = db.models.recipe;

class RecipeModel {
  async create ( body ) {
    const recipe = await model.create( body );
    return cleanData( recipe.toJSON() );
  }

  async delete ( _id ) {
    const recipe = await model.findOneAndUpdate( { _id }, { isDeleted: true } ).lean();
    return cleanData( recipe );
  }

  getAllByCategory ( id ) {
    return model.find( { categoryId: id, isDeleted: false }, {
      isDeleted: 0,
    } ).lean();
  }

  async getOneById ( _id ) {
    const recipe = await model.findOne( { _id, isDeleted: false } ).lean();
    return cleanData( recipe );
  }

  async updateCategory ( { categoryId, _id } ) {
    const recipe = await model.findOneAndUpdate( {
      _id,
      isDeleted: false,
    }, { categoryId }, { returnOriginal: false } ).lean();
    return cleanData( recipe );
  }

  async update ( { _id, ...body } = {} ) {
    const recipe = await model.findOneAndUpdate( {
      _id,
      isDeleted: false,
    }, { ...body }, { returnOriginal: false } ).lean();
    return cleanData( recipe );
  }

  async isExist ( _id ) {
    const isExist = await model.findOne( { _id, isDeleted: false } ).lean();
    return !!isExist;
  }
}

export default new RecipeModel();