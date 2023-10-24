const { CONSUMER_GROUP, LISTEN_TOPIC, RESPOND_TOPIC } = require('./config');
const { newBooking } = require('./event-producer');
const kafka = require('./kafka.config');
const logger = require('./logger/logger');

const IORedis = require('ioredis');
const redis = new IORedis();

const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });

const run = async () => {
    // Consuming
    await consumer.connect()

    logger.info(`subscribing to ${process.env.LISTEN_TOPIC || 'error'}`);
    await consumer.subscribe({ topic: LISTEN_TOPIC, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            //logger.debug(`Reciveing the Message: ${message.value}`)
            const newMessage = JSON.parse(message.value.toString());
            logger.debug(`New Message: ${JSON.stringify(newMessage)}`);

            await newBooking(RESPOND_TOPIC || 'error', {
                from: process.env.SERVICE_NAME,
                type: 'REGISTRATION',
                key: newMessage?.key,
                result: 'success'
            }).catch((e) => {
                throw new Error('error on publishing message');
            });

            logger.debug('responded to message');

            await consumer.commitOffsets([
                {
                    topic,
                    partition,
                    offset: (Number(message.offset) + 1).toString(),
                },
            ]);
        },
    })
}

module.exports = run;