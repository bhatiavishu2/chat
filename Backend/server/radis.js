const RedisServer = require('redis-server');

// Simply pass the port that you want a Redis server to listen on.
const serverRedis = new RedisServer(6379);

serverRedis.open((err) => {
  if (err === null) {
    // You may now connect a client to the Redis
    // server bound to port 6379.
  }
});