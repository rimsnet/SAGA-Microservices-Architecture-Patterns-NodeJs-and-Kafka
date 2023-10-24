module.exports = {
    NODE_ENV: 'DEV',
    SERVICE_NAME: 'activation',
    SERVICE_PORT: 3004,
    BROKER_URL: 'localhost:9092',
    CONSUMER_GROUP: 'activation-group',
    LISTEN_TOPIC: 'new-booking',
    RESPOND_TOPIC: 'new-booking-response'
}