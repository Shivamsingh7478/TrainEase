const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('🌱 [DB] MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'NOT FOUND');
console.log('🌱 [DB] JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'NOT FOUND');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ [DB] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ [DB] MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB; 