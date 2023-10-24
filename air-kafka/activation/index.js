const express = require('express');
const logger = require('./logger/logger');
const run = require('./event-consumer');
const { SERVICE_PORT } = require("./config");

const app = express();
const port = SERVICE_PORT;

run().catch((e) => logger.error('error on subscribing to topic'));

app.listen(port, () => {
    logger.info(`Registration service running on port ${port}`);
});