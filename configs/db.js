const mongoose = require('mongoose');

const dbConnection = mongoose.connect(process.env.MONGO_URL);

module.exports = { dbConnection };