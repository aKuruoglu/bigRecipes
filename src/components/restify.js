import os from 'os';
import Restify from 'restify';
import corsMiddleware from 'restify-cors-middleware';
import { InternalServerError } from 'restify-errors';
import config from 'config';
import { cloneDeep } from 'lodash';

import logger from 'components/logger';
import crawler from 'utils/crawler';

class RestifyWrap {
  constructor () {
    this.server = Restify.createServer({
      url: config.get('server.urlPrefix'),
    });

    this.server.use(Restify.plugins.acceptParser(this.server.acceptable));

    const cors = corsMiddleware(cloneDeep(config.get('server.cors')));
    this.server.pre(cors.preflight);
    this.server.use(cors.actual);

    this.server.pre(Restify.plugins.queryParser());
    this.server.use(Restify.plugins.bodyParser({
      ...cloneDeep(config.get('server.bodyParser')),
      uploadDir: os.tmpdir(),
    }));
  }

  routerWrap (middleware) {
    return async (req, res, next) => {
      try {
        await middleware(req, res, next);
      } catch (e) {
        if(e instanceof Error) {
          logger.error(e.stack);
          return next(e);
        }

        logger.error(e);
        next(new InternalServerError(e));
      }
    };
  }

  version (list) {
    return Restify.plugins.conditionalHandler(list.map(item => {
      item.handler = this.routerWrap(item.handler);
      return item;
    }));
  }

  async start () {
    await crawler('route', (itemPath) => {
      try {
        require(itemPath);
      } catch (e) {
        if(e instanceof Error) {
          return logger.error(e.stack);
        }

        logger.error(e);
      }
    });

    this.server.listen(config.get('server.port'), () =>
      logger.info(`'${this.server.name}' server started on ${config.get('server.port')}`));
  }
}

export default new RestifyWrap();
