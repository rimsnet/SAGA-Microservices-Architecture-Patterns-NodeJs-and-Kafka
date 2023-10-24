module.exports = {
    NODE_ENV: 'DEV',
    SERVICE_NAME: 'registration',
    SERVICE_PORT: 3002,
    BROKER_URL: 'localhost:9092',
    CONSUMER_GROUP: 'registration-group',
    LISTEN_TOPIC: 'new-booking',
    RESPOND_TOPIC: 'new-booking-response'
}