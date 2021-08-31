import os from 'os';

module.exports = {
  logger: {
    level: 'silly',
  },
  mongo: {
    uri: 'mongodb://localhost:27017/abrika',
  },
  redis: {
    host: '127.0.0.1',
    port: '6379',
  },
  server: {
    name: 'internal',
    urlPrefix: '/api',
    port: '4000',
    cors: {
      origins: ['*'],
      allowHeaders: ['Authorization'],
    },
    bodyParser: {
      multiples: true,
      rejectUnknown: true,
      maxFieldsSize: 5242880, // 5 * 1024 * 1024
      uploadDir: os.tmpdir(),
    },
  },
};