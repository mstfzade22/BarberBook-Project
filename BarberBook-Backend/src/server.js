require("dotenv").config();
const createApp = require("./app");
const connectDB = require("./config/database");
const dataStore = require("./services/dataStore");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await dataStore.initialize();

    const app = createApp();

    app.listen(PORT, () => {
      console.log("");
      console.log("========================================");
      console.log("  BarberBook API Server");
      console.log("========================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Base: http://localhost:${PORT}/api`);
      console.log("========================================");
      console.log("");
      console.log("Available endpoints:");
      console.log("  POST   /api/auth/register");
      console.log("  POST   /api/auth/login");
      console.log("  GET    /api/auth/me");
      console.log("  GET    /api/barbers");
      console.log("  GET    /api/barbers/:id");
      console.log("  GET    /api/barbers/:id/availability");
      console.log("  POST   /api/appointments");
      console.log("  GET    /api/appointments");
      console.log("  GET    /api/appointments/calendar");
      console.log("  GET    /api/appointments/:id");
      console.log("  PUT    /api/appointments/:id");
      console.log("  DELETE /api/appointments/:id");
      console.log("========================================");
      console.log("");
      console.log("💡 Demo Credentials:");
      console.log("  Customer: demo@customer.com / password");
      console.log("  Barber 1: john@barberbook.com / password");
      console.log("  Barber 2: mike@barberbook.com / password");
      console.log("  Barber 3: carlos@barberbook.com / password");
      console.log("========================================");
      console.log("");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  process.exit(1);
});

startServer();
