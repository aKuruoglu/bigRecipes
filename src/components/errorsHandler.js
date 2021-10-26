import { isArray, isString } from 'lodash';


class ErrorsHandler extends Error{
  constructor (message, { statusCode = 400, type, errors } = {}) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static itemHandler (item) {
    if(isString(item)) {
      return item;
    }

    return item.message;
  }

  static make (errors, statusCode = 400, type) {
    let message, data = errors;
    if(isArray(errors)) {
      message = errors.map(item => ErrorsHandler.itemHandler(item));
    } else {
      message = [ErrorsHandler.itemHandler(errors)];
      data = [errors];
    }
    return new ErrorsHandler(message, { statusCode, type, errors: data });
  }

  static throw (errors, statusCode = 400, type) {
    throw ErrorsHandler.make(errors, statusCode, type);
  }

}

export default ErrorsHandler;