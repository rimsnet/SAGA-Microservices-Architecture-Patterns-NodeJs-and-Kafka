module.exports = {
    NODE_ENV: 'DEV',
    SERVICE_NAME: 'new-booking',
    SERVICE_PORT: 3001,
    BROKER_URL: 'localhost:9092',
    CONSUMER_GROUP: 'new-booking-group',
    LISTEN_TOPIC: 'new-booking-response',
    PRODUCE_TOPIC: 'new-booking'
}