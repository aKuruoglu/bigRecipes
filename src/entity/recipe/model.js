import db from 'components/db';
// import { cleanData } from 'components/utils';

const model = db.models.recipe;

class RecipeModel {
  async createRecipe ( body ) {
    await model.create( body );
  }

  async isExist ( id ) {
    const isExist = await model.findOne( { _id: id } );
    return !!isExist;
  }
}

export default new RecipeModel();