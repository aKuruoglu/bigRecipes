import db from 'components/db';
import redis from 'components/redis';
import logger from 'components/logger';
import restify from 'components/restify';

export default async () => {
  try {
    await db.init();
    await redis.init();
    await restify.start();
  } catch (err) {
    logger.error(err);
  }
};
