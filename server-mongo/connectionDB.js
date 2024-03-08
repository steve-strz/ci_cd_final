require('dotenv').config()
const mongoose = require('mongoose');

async function connect() {
  mongoose.connect(process.env.DATABASE_CONNECTION, {})
  mongoose.connection.once('open', () => {
    console.log('MongoDB connection established');
  }).on('error', (err) => {
    console.log('MongoDB connection error : ', err);
  })
}

module.exports = { connect };