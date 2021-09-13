import validator from 'components/validator';
import CategoryModel from 'entity/category/model';
import RecipeModel from 'entity/recipe/model';

class RecipeCheck {
  constructor () {
    this.byRecipeIdSchema = {
      _id: {
        type: 'objectID',
        custom: async ( value, errors ) => {
          const res = await RecipeModel.checkExist( value );
          if ( !res ) {
            errors.push( { type: 'noRecipe', actual: value, code: 404 } );
            return value;
          }
          return value;
        },
      },
    };

    this.byCategoryIdSchema = {
      categoryId: {
        type: 'objectID',
        custom: async ( value, errors ) => {
          const res = await CategoryModel.checkExist( value );
          if ( !res ) {
            errors.push( { type: 'noCategory', actual: value, code: 404 } );
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
      ...this.byCategoryIdSchema,
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