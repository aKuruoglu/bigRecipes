import validator from 'components/validator';
import CategoryControl from 'entity/category/control';
import RecipeControl from 'entity/recipe/control';

class RecipeCheck {
  constructor () {
    this.byRecipeIdSchema = {
      _id: {
        type: 'objectID',
        custom: async ( value, errors ) => {
          const res = await RecipeControl.checkExistRecipe( value );
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
          const res = await CategoryControl.checkExistCategory( value );
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

  checkCreateBody ( body ) {
    return validator.checkCreateEntity( body, {
      ...this.mainSchema,
      ...this.byCategoryIdSchema,
    } );
  }

  checkIsExist ( id ) {
    return validator.checkExistId( id, this.byRecipeIdSchema._id );
  }

  checkExistCategory ( categoryId ) {
    return validator.checkExistId( categoryId, this.byCategoryIdSchema.categoryId);
  }

  checkUpdateRecipe ( body ) {
    return validator.checkExistFields( body, this.mainSchema, this.byRecipeIdSchema );
  }


}

export default new RecipeCheck();