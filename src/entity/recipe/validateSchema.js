import validator from 'components/validator';
import RecipeModel from 'entity/recipe/model';

class RecipeCheck {
  constructor () {
    this.byRecipeIdSchema = {
      _id: {
        type: 'objectID',
        custom: async ( value, errors ) => {
          const res = await RecipeModel.isExist( value );
          if ( !res ) {
            errors.push( { type: 'noRecipe', actual: value, code: 404 } );
            return value;
          }
          return value;
        },
      },
    };

    this.mainSchema = {
      title: { type: 'string', min: 3, max: 100 },
      description: { type: 'string', min: 3, max: 255 },
    };
  }

  create ( body ) {
    return validator.create( body, {
      ...this.mainSchema,
    } );
  }

  existId ( id ) {
    return validator.existId( id, this.byRecipeIdSchema._id );
  }

  update ( body ) {
    return validator.existFields( body, this.mainSchema, this.byRecipeIdSchema._id );
  }


}

export default new RecipeCheck();