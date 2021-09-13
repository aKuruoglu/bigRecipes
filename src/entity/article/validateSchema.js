import validator from 'components/validator';
import CategoryModel from 'entity/category/model';
import ArticleModel from 'entity/article/model';

class ArticleCheck {
  constructor () {
    this.byArticleIdSchema = {
      _id: {
        type: 'objectID',
        custom: async ( value, errors ) => {
          const res = await ArticleModel.checkExist( value );
          if ( !res ) {
            errors.push( { type: 'noArticle', actual: value, code: 404 } );
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
      mainText: { type: 'string' },
    };
  }

  create ( body ) {
    return validator.create( body, this.mainSchema );
  }

  update ( body ) {
    return validator.existFields( body, this.mainSchema, this.byArticleIdSchema._id );
  }

  existId ( _id ) {
    return validator.existId( _id, this.byArticleIdSchema._id );
  }
}

export default new ArticleCheck();