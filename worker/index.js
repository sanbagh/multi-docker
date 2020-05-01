const keys = require('./keys');
const redis = require('redis');

const client = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
function Fib(index) {
  if (index < 2) return 1;
  return Fib(index - 1) + Fib(index - 2);
}
const sub = client.duplicate();
sub.on('message', (channel, message) => {
  client.hset('Values', message, Fib(parseInt(message)));
});
sub.subscribe('insert');
