
const express = require('express');
const consumer = require('./event-consumer');
const { newBooking } = require('./event-producer');
const CONFIG = require('./config');
const logger = require('./logger/logger');

const IORedis = require('ioredis');
const redis = new IORedis();
const { v4: uuidV4 } = require('uuid');

consumer().catch(error => logger.error('Error on subscribing to topic'));
const app = express();

app.post('/', express.json(), async (req, res) => {

    const passportNumber = req.body.passportNumber;

    logger.debug(`New booking initiate: ${passportNumber}`);

    const uniqueKey = uuidV4();
    const redisKey = `rimsan:new-booking:registration:${passportNumber}:${uniqueKey}`;
    const workflow = {
        history: { newBooking: 'pending' },
        payment: 'pending',
        activation: 'pending'
    }
    logger.debug(`Redis Key: ${redisKey}`);
    const save = await redis.set(redisKey, JSON.stringify(workflow));

    const event = {
        from: CONFIG.SERVICE_NAME,
        type: 'NEW_BOOKING',
        key: passportNumber,
        result: 'pending'
    }

    await newBooking(CONFIG.PRODUCE_TOPIC, event);

    res.send(uniqueKey);
});

app.get('/:passportNumber', async (req, res) => {

    const passportNumber = req.params.passportNumber;
    const key = req.query.key;

    const keyPattern = `rimsan:new-booking:registration:${passportNumber}:${key}`;
    const connection = await redis.get(keyPattern);
    logger.debug(connection, ' cached output');
    res.status(200).send(connection)

});

app.listen(CONFIG.SERVICE_PORT, () => 
    logger.info(`Running Booking server port: ${CONFIG.SERVICE_PORT}`)
);