import { createLogger, format, transports } from 'winston';
import { isObject } from 'lodash';
import config from 'config';

const { combine, timestamp, printf } = format;

const logger = createLogger({
  ...config.get('logger'),
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp }) =>
      `${level}: [${timestamp}] ${isObject(message) ? JSON.stringify(message, null, 2) : message}
`),
  ),
  transports: [new transports.Console()],
});

export default logger;
