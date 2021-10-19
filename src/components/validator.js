import Validator from 'fastest-validator';
import { mongo } from 'mongoose';
import { keys, isBoolean, omit, has } from 'lodash';
import ErrorsHandler from 'components/errorsHandler';
import CategoryModel from 'entity/category/model';

class MainValidate extends Validator {
  async compaileSchema ( schema ) {
    const validateFn = await super.compile( schema );
    // eslint-disable-next-line require-await
    return async ( data ) => {
      const isValid = await validateFn( data );

      if ( isBoolean( isValid ) ) {
        return;
      }

      const codes = isValid
        .map( item => {
          if ( !item.code ) {
            return {
              ...item,
              code: 400,
            };
          }

          return item;
        } )
        .reduce( ( all, item ) => ({
          ...all,
          [ item.code ]: true,
        }), {} );

      ErrorsHandler.throw( isValid, keys( codes ).length > 1 ? 400 : keys( codes )[ 0 ] );
    };
  }

  async existId ( _id, schema ) {
    const check = await validator.compaileSchema( {
      _id: schema,
      $$async: true,
    } );
    return check( { _id } );
  }

  async create ( body, schema ) {
    const check = await validator.compaileSchema( {
      ...schema,
      $$async: true,
    } );
    return check( body );
  }

  async existFields ( body, mainSchema, secondSchema ) {
    const schema = keys( omit( body, ['categoryId'] ) )
      .reduce( ( all, key ) => {
        if ( has( mainSchema, key ) ) {
          return {
            ...all,
            [ key ]: mainSchema[ key ],
          };
        }
        return all;
      }, {} );
    const check = await validator.compaileSchema( {
      ...schema,
      _id: secondSchema,
      $$async: true,
    } );
    return check( body );
  }

  async possibleChangeParent ( { _id }, { parentCategoryId } ) {
    if ( !parentCategoryId ) {
      return;
    }

    const categories = await CategoryModel.getAll();
    const categoriesMap = new Map( categories.map( ( item ) => [String( item._id ), item] ) );
    let parent;
    let checkId = parentCategoryId;
    let currentId = String( _id );

    while ( checkId ) {
      if ( checkId === currentId ) {
        break;
      }

      parent = categoriesMap.get( checkId );
      checkId = parent.parentCategoryId ? parent.parentCategoryId.toString() : parent.parentCategoryId;
    }

    if ( checkId ) {
      const response = {
        message: 'Sorry you cannot change to the given parent category as it is a child category',
      };
      ErrorsHandler.throw( response, 400 );
    }
  }
}

const validator = new MainValidate( {
  useNewCustomCheckerFunction: true,
  defaults: {
    objectID: {
      ObjectID: mongo.ObjectId,
    },
  },
  messages: {
    noCategory: 'There is no such category',
    noArticle: 'There is no such article',
  },
} );

export default validator;