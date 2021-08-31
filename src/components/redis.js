import config from 'config';
import Redis from 'redis';
import { promisify } from 'util';
import { isObject } from 'lodash';
import { v4 as uuid } from 'uuid';

import logger from 'components/logger';

class Store {
  async init () {
    await new Promise((resolve) => {
      this.client = Redis.createClient(config.get('redis'));

      this.client.on('error', (error) => {
        logger.error(error);
      });

      this.client.on('connect', () => {
        logger.info('Connected to Redis');
        resolve();
      });
    });

    this.get = promisify(this.client.get).bind(this.client);
    this.set = promisify(this.client.set).bind(this.client);
    this.hset = promisify(this.client.hset).bind(this.client);
    this.hget = promisify(this.client.hget).bind(this.client);
    this.hdel = promisify(this.client.hdel).bind(this.client);
    this.del = promisify(this.client.del).bind(this.client);
  }

  async makeUniq ({ prefix = '', data = {}, px = 0 } = {}) {
    let stringify = data;
    if (stringify.toJSON) {
      stringify = stringify.toJSON();
    }

    if (isObject(stringify)) {
      stringify = JSON.stringify(stringify);
    }

    let otp, key;
    do {
      otp = uuid();
      key = prefix ? `${prefix}_${otp}` : otp;
      if (!(await this.get(key))) {
        break;
      }
      // eslint-disable-next-line no-constant-condition
    } while (true);

    const params = [];
    if (px) {
      params.push('PX', px);
    }

    await this.set(key, stringify, ...params);

    return otp;
  }

  async getUniq ({ prefix = '', otp, shouldDelete = false }) {
    const key = prefix ? `${prefix}_${otp}` : otp;
    const data = await this.get(key);

    if (shouldDelete) {
      await this.del(key);
    }

    if (data) {
      try {
        return JSON.parse(data);
        // eslint-disable-next-line no-empty
      } catch (e) { }
    }

    return data;
  }
}

export default new Store();
