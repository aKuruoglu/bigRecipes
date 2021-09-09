import { isArray, isString } from 'lodash';


class ErrorsHandler extends Error{
  constructor (message, { code = 400, type, errors } = {}) {
    super(message);
    this.type = type;
    this.code = code;
    this.errors = errors;
  }

  static itemHandler (item) {
    if(isString(item)) {
      return item;
    }

    return item.message;
  }

  static make (errors, code = 400, type) {
    let message, data = errors;
    if(isArray(errors)) {
      message = errors.map(item => ErrorsHandler.itemHandler(item));
    } else {
      message = [ErrorsHandler.itemHandler(errors)];
      data = [errors];
    }
    return new ErrorsHandler(message, { code, type, errors: data });
  }

  static throw (errors, code = 400, type) {
    throw ErrorsHandler.make(errors, code, type);
  }

}

export default ErrorsHandler;