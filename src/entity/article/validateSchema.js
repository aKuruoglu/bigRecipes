import validator from 'components/validator';
import CategoryControl from 'entity/category/control';
import ArticleControl from 'entity/article/control';

class ArticleCheck {
  constructor () {
    this.byArticleIdSchema = {
      id: {
        type: 'objectID',
        custom: async ( value, errors ) => {
          const res = await ArticleControl.checkExistArticle( value );
          if ( !res ) {
            errors.push( { type: 'noArticle', actual: value, code: 404 } );
            return value;
          }
          return value;
        },
      },
    };

    this.byCategoryIdSchema = {
      id: {
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
      mainText: { type: 'string' },
    };
  }

  checkCreate ( body ) {
    return validator.checkCreateEntity( body, this.mainSchema );
  }

  checkDelete ( id ) {
    return validator.checkExistId( id, this.byArticleIdSchema );
  }

  checkUpdate ( body ) {
    return validator.checkExistFields( body, this.mainSchema, this.byArticleIdSchema );
  }

  checkExistCategory ( categoryId ) {
    return validator.checkExistId( categoryId, this.byCategoryIdSchema );
  }

  checkExist ( id ) {
    return validator.checkExistId( id, this.byArticleIdSchema );
  }
}

export default new ArticleCheck();