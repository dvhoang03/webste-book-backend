import { Configuration } from 'log4js';

export const log4jsConfig: Configuration = {
  appenders: {
    console: { type: 'console' },
    appFile: {
      type: 'dateFile',
      filename: 'logs/app.log',
      pattern: '-yyyy-MM-dd',
      compress: true,
      daysToKeep: 7,
      keepFileExt: true,
    },
    httpFile: {
      type: 'dateFile',
      filename: 'logs/http.log',
      pattern: '-yyyy-MM-dd',
      compress: true,
      daysToKeep: 7,
      keepFileExt: true,
    },
    errorFile: {
      type: 'file',
      filename: 'logs/error.log',
    },

    // Bộ lọc log level cho http
    httpFilter: {
      type: 'logLevelFilter',
      appender: 'httpFile',
      level: 'info',
    },

    // Bộ lọc cho error
    errorFilter: {
      type: 'logLevelFilter',
      appender: 'errorFile',
      level: 'error',
    },
  },
  categories: {
    default: {
      appenders: ['console', 'appFile', 'errorFilter'],
      level: 'debug',
    },
    http: {
      appenders: ['console', 'httpFilter'],
      level: 'info',
    },
  },
};
