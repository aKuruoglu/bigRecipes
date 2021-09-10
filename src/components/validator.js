import Validator from 'fastest-validator';
import { mongo } from 'mongoose';
import { keys, isBoolean, omit, has } from 'lodash';
import ErrorsHandler from 'components/errorsHandler';

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

  async checkExistId ( id, schema ) {
    const key = keys( schema );
    const check = await validator.compaileSchema( {
      ...schema,
      $$async: true,
    } );
    return check( { [ key[ 0 ] ]: id } );
  }

  async checkCreateEntity ( body, schema ) {
    const check = await validator.compaileSchema( {
      ...schema,
      $$async: true,
    } );
    return check( body );
  }

  async checkExistFields ( body, mainSchema, secondSchema ) {
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
      ...secondSchema,
      $$async: true,
    } );
    return check( body );
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