import validator from 'components/validator';
import CategoryModel from 'entity/category/model';
import { isNull } from 'lodash';

class CategoryCheck {
  constructor () {
    this.byCategoryIdSchema = {
      _id: {
        type: 'objectID',
        custom: async ( value, errors ) => {
          const res = await CategoryModel.isExist( value );
          if ( !res ) {
            errors.push( { type: 'noCategory', actual: value, code: 404 } );
            return value;
          }
          return value;
        },
      },
    };
    this.byParentIdSchema = {
      parentCategoryId: {
        type: 'objectID',
        required: false,
        nullable: true,
        custom: async ( value, errors ) => {
          if ( isNull( value ) ) {
            return value;
          }
          const res = await CategoryModel.isExist( value );
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

  create ( body ) {
    return validator.create( body, this.mainSchema );
  }

  update ( body ) {
    return validator.existFields( body,
      { ...this.mainSchema, ...this.byParentIdSchema },
      this.byCategoryIdSchema._id );
  }

  updateParent ( _id, parent ) {
    return validator.possibleChangeParent( _id, parent );
  }

  existId ( _id ) {
    return validator.existId( _id, this.byCategoryIdSchema._id );
  }
}

export default new CategoryCheck();