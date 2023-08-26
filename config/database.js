const mongoose = require('mongoose');
const URL = process.env.MONGODB_URL;

const ConnectMongoDB = async () => {
  try {
    await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log("Connected to MongoDB");
  } catch (err) {
    console.log('MongoDB Connection Failed');
  }
}

module.exports = ConnectMongoDB;