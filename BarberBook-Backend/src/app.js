const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const barberRoutes = require("./routes/barberRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:8000",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.get("/health", (req, res) => {
    res.json({
      success: true,
      message: "BarberBook API is running",
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/barbers", barberRoutes);
  app.use("/api/appointments", appointmentRoutes);

  // Serve static frontend files in production
  if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../../public");
    app.use(express.static(frontendPath));

    // Serve index.html for all non-API routes (SPA support)
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    app.use(notFound);
  }

  app.use(errorHandler);

  return app;
};

module.exports = createApp;
