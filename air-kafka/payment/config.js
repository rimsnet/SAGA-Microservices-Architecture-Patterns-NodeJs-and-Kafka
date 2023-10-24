module.exports = {
    NODE_ENV: 'DEV',
    SERVICE_NAME: 'payment',
    SERVICE_PORT: 3003,
    BROKER_URL: 'localhost:9092',
    CONSUMER_GROUP: 'payment-group',
    LISTEN_TOPIC: 'new-booking',
    RESPOND_TOPIC: 'new-booking-response'
}