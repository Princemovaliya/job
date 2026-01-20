const IORedis = require("ioredis");
const env = require("./env");

const connection = new IORedis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: null
});

connection.on("error", (error) => {
  console.error("Redis error", error);
});

const connectRedis = async () => {
  if (connection.status !== "ready") {
    await connection.connect();
  }

  return connection;
};

module.exports = { connection, connectRedis };
