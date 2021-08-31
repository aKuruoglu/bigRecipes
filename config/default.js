import os from 'os';

module.exports = {
  logger: {
    level: 'silly',
  },
  mongo: {
    uri: '',
  },
  redis: {
    host: '',
    port: '',
  },
  server: {
    name: '',
    urlPrefix: '',
    port: '',
    cors: {
      origins: [''],
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
