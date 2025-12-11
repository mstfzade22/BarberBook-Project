// API Configuration
// This file manages API endpoints for different environments

const API_CONFIG = {
  // Development (local)
  development: {
    API_URL: "http://localhost:5001",
    API_BASE: "http://localhost:5001/api",
  },

  // Production (Render)
  production: {
    API_URL: "https://barberbook-backend.onrender.com",
    API_BASE: "https://barberbook-backend.onrender.com/api",
  },
};

// Automatically detect environment
const ENV =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "development"
    : "production";

// Export current environment configuration
const API_URL = API_CONFIG[ENV].API_URL;
const API_BASE = API_CONFIG[ENV].API_BASE;

// API endpoints
const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE}/auth/login`,
  REGISTER: `${API_BASE}/auth/register`,
  PROFILE: `${API_BASE}/auth/profile`,

  // Barber endpoints
  BARBERS: `${API_BASE}/barbers`,
  BARBER_AVAILABILITY: (barberId) =>
    `${API_BASE}/barbers/${barberId}/availability`,

  // Appointment endpoints
  APPOINTMENTS: `${API_BASE}/appointments`,
  MY_APPOINTMENTS: `${API_BASE}/appointments/my-appointments`,
  APPOINTMENT_DETAIL: (id) => `${API_BASE}/appointments/${id}`,
  CANCEL_APPOINTMENT: (id) => `${API_BASE}/appointments/${id}/cancel`,

  // Health check
  HEALTH: `${API_URL}/health`,
};

// Log current environment
console.log(`🌍 Environment: ${ENV}`);
console.log(`🔗 API Base URL: ${API_BASE}`);
