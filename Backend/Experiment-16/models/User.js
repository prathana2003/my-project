const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0, min: 0 }
});

module.exports = mongoose.model('User', userSchema);