const mongoose = require("mongoose");

const { MONGODB_CONNECT_URI } = process.env;

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_CONNECT_URI, dbOptions);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
