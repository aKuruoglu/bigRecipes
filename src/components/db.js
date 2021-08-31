import mongoose from 'mongoose';
import config from 'config';

import crawler from 'utils/crawler';
import logger from 'components/logger';

class Mongo {
  constructor () {
    this.models = {};
  }

  async init () {
    this.db = await mongoose.createConnection(config.get('mongo.uri')).asPromise();

    this.db.on('error', (error) => {
      logger.error(error);
    });

    logger.info('Connected to MongoDB');
    await this.createModels();
  }

  createModels () {
    return crawler('schema', (itemPath, name) => {
      try {
        this.models[name] = this.db.model(name, require(itemPath).default);
      } catch (e) {
        logger.error(e);
      }
    });
  }
}

export default new Mongo();
