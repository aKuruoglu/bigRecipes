import Validator from 'fastest-validator';
import { mongo } from 'mongoose';
import { keys, isBoolean } from 'lodash';
import ErrorsHandler from 'components/errorsHandler';

class MainValidate extends Validator {
  async compaileSchema (schema) {
    const validateFn = await super.compile(schema);
    // eslint-disable-next-line require-await
    return async ( data ) => {
      const isValid = await validateFn(data);

      if (isBoolean(isValid)) {
        return;
      }

      const codes = isValid
        .map(item => {
          if (!item.code) {
            return {
              ...item,
              code: 400,
            };
          }

          return item;
        })
        .reduce((all, item) => ({
          ...all,
          [item.code]: true,
        }), {});

      ErrorsHandler.throw(isValid, keys(codes).length > 1 ? 400 : keys(codes)[0]);
    };
  }

}

const validator = new MainValidate({
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
});

export default validator;