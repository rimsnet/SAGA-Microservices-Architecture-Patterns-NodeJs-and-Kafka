const { LISTEN_TOPIC } = require('./config');
const kafka = require('./kafka.config');

const producer = kafka.producer();

const newBooking = async (topic, payload, key) => {
    // Producing
    await producer.connect();

    if (key) {
        await producer.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(payload),
                    key
                },
            ],
        });
    } else {
        await producer.send({
            topic: topic,
            messages: [
                { value: JSON.stringify(payload) },
            ],
        });
    }
}

module.exports = { send, newBooking };