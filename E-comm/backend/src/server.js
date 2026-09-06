require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Nebula API Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 URL: http://localhost:${PORT}/api/v1\n`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err.message);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
