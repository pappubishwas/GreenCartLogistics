const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Mongo connected');
  } catch (err) {
    console.error('Mongo connection error', err);
    process.exit(1);
  }
};

module.exports = connectDB;
