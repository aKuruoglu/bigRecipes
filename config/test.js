import os from 'os';

module.exports = {
  logger: {
    level: 'silly',
  },
  mongo: {
    uri: 'mongodb://localhost:27018/abrika',
  },
  redis: {
    host: '127.0.0.1',
    port: '6380',
  },
  server: {
    name: 'internal',
    urlPrefix: '/api',
    port: '4001',
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