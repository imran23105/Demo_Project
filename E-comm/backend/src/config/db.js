const dns = require('dns');
const mongoose = require('mongoose');

// Resolve MongoDB Atlas SRV records reliably across all ISPs/Windows routers
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  // Ignore if not supported in environment
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
