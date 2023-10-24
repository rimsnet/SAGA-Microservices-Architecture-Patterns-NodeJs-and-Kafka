const pino = require('pino');
const dayjs = require("dayjs");
const { NODE_ENV } = require('../config');

const logger = pino({
    level: NODE_ENV === 'prod' ? 'info' : 'trace',
    timestamp: () => `,"time": "${dayjs().format()}"`,
  });

module.exports = logger;