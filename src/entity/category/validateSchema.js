import validator from 'components/validator';
import CategoryModel from 'entity/category/model';

class CategoryCheck {
  constructor () {
    this.byCategoryIdSchema = {
      _id: {
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
      name: { type: 'string', min: 3, max: 50 },
    };
  }

  // create ( body ) {
  //   return validator.checkCreateEntity( body, this.mainSchema );
  // }
  //
  // delete ( id ) {
  //   return validator.checkExistId( id, this.byArticleIdSchema._id );
  // }
  //
  // update ( body ) {
  //   return validator.checkExistFields( body, this.mainSchema, this.byArticleIdSchema._id );
  // }
  //
  // existCategory ( categoryId ) {
  //   return validator.checkExistId( categoryId, this.byCategoryIdSchema.categoryId );
  // }

  existId ( _id ) {
    return validator.checkExistId( _id, this.byCategoryIdSchema._id );
  }
}

export default new CategoryCheck();