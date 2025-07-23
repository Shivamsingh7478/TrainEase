const mongoose = require('mongoose');

const allowlistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, default: 'invited' }
});

module.exports = mongoose.model('Allowlist', allowlistSchema);
