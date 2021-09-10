import db from 'components/db';
import { cleanData } from 'components/utils';

const model = db.models.recipe;

class RecipeModel {
  async create ( body ) {
    const recipe = await model.create( body );
    return cleanData( recipe.toJSON() );
  }

  async delete ( recipeId ) {
    const recipe = await model.findOneAndUpdate( { _id: recipeId }, { isDeleted: true } ).lean();
    return cleanData( recipe );
  }

  async getAllByCategory ( categoryId ) {
    const recipes = await model.find( { categoryId, isDeleted: false } ).lean();
    return recipes.map( item => cleanData( item ) );
  }

  async getOneById ( recipeId ) {
    const recipe = await model.findOne( { _id: recipeId } ).lean();
    return cleanData( recipe );
  }

  async updateCategory ( categoryId, recipeId ) {
    const recipe = await model.findOneAndUpdate( { _id: recipeId }, { categoryId } ).lean();
    return cleanData( recipe );
  }

  async update ( { recipeId, ...body } = {} ) {
    const recipe = await model.findOneAndUpdate( { _id: recipeId }, { ...body }, { returnOriginal: false } ).lean();
    return cleanData( recipe );
  }

  async isExist ( id ) {
    const isExist = await model.findOne( { _id: id, isDeleted: false } ).lean();
    return !!isExist;
  }
}

export default new RecipeModel();