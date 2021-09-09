import validator from 'components/validator';
import CategoryControl from 'entity/category/control';
import ArticleControl from 'entity/article/control';
import { has, keys, omit } from 'lodash';

class ArticleCheck {
  constructor () {
    this.byArticleIdSchema = {
      articleId: {
        type: 'objectID',
        custom: async (value, errors) => {
          const res = await ArticleControl.checkExistArticle(value);
          if (!res) {
            errors.push({ type: 'noArticle', actual: value, code: 404 });
            return value;
          }
          return value;
        },
      },
    };

    this.byCategoryIdSchema = {
      categoryId: {
        type: 'objectID',
        custom: async (value, errors) => {
          const res = await CategoryControl.checkExistCategory(value);
          if (!res) {
            errors.push({ type: 'noCategory', actual: value, code: 404 });
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

    this.updateArticleCategorySchema = {
      ...this.byCategoryIdSchema,
      ...this.byArticleIdSchema,
    };
  }

  async checkCreateArticle ( body ) {
    const check = await validator.compaileSchema({
      ...this.mainSchema,
      ...this.byCategoryIdSchema,
      $$async: true,
    });
    return check(body);
  }

  async checkDeleteArticle ( articleId ) {
    const check = await validator.compaileSchema({
      ...this.byArticleIdSchema,
      $$async: true,
    });
    return check( { articleId } );
  }

  async checkUpdateArticleCategory (body) {
    const check = await validator.compaileSchema({
      ...this.updateArticleCategorySchema,
      $$async: true,
    });
    return check( body );
  }

  async checkUpdateArticle (body) {
    const schema = keys(omit(body, ['categoryId']))
      .reduce((all, key) => {
        if (has(this.mainSchema, key)) {
          return {
            ...all,
            [key]: this.mainSchema[key],
          };
        }
        return all;
      }, {});
    const check = await validator.compaileSchema({
      ...schema,
      ...this.byArticleIdSchema,
      $$async: true,
    });
    return check( body );
  }

  async checkExistCategory ( categoryId ) {
    const check = await validator.compaileSchema({
      ...this.byCategoryIdSchema,
      $$async: true,
    });
    return check( { categoryId } );
  }

  async checkExistArticle (articleId) {
    const check = await validator.compaileSchema({
      ...this.byArticleIdSchema,
      $$async: true,
    });
    return check({ articleId } );
  }
}

export default new ArticleCheck();