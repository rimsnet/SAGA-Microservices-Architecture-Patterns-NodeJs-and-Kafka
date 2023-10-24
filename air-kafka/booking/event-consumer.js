const { CONSUMER_GROUP, LISTEN_TOPIC, PRODUCE_TOPIC } = require('./config');
const kafka = require('./kafka.config');
const logger = require('./logger/logger');

const IORedis = require('ioredis');
const redis = new IORedis();

const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });

const run = async () => {
    // Consuming
    await consumer.connect()

    await consumer.subscribe({ topic: LISTEN_TOPIC, fromBeginning: true });
    await consumer.subscribe({ topic: PRODUCE_TOPIC, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            const newMessage = JSON.parse(message.value.toString());
            logger.debug(`New Message: ${JSON.stringify(newMessage)}`);

            const keyPattern = `rimsan:new-booking:registration:${newMessage.key}:*`;
            const redisKey = await redis.keys(keyPattern);
            const workflow = JSON.parse(await redis.get(redisKey[0]));
            logger.debug(`Workflow: ${workflow}`);

            if (newMessage.type == 'REGISTRATION') {
                logger.debug(`REGISTRATION result : ${newMessage.result}`);
                workflow.history.newBooking = newMessage.result;

                const status = await redis.set(redisKey[0], JSON.stringify(workflow));
            }

            if (newMessage.type == 'PAYMENT') {
                logger.debug(`PAYMENT result : ${newMessage.result}`);
                workflow.payment = newMessage.result;

                const status = await redis.set(redisKey[0], JSON.stringify(workflow));
            }

            if (newMessage.type == 'ACTIVATION') {
                logger.debug(`ACTIVATION result : ${newMessage.result}`);
                workflow.activation = newMessage.result;

                const status = await redis.set(redisKey[0], JSON.stringify(workflow));
            }
        },
    })
}

module.exports = run;