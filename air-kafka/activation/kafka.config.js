const { Kafka } = require('kafkajs');
const CONFIG = require('./config');

const kafka = new Kafka({
    clientId: CONFIG.SERVICE_NAME,
    brokers: [CONFIG.BROKER_URL]
});

module.exports = kafka;
