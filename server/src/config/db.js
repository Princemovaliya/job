const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  await mongoose.connect(env.MONGO_URI, {
    autoIndex: env.NODE_ENV !== "production"
  });

  return mongoose.connection;
};

module.exports = { connectDB };
