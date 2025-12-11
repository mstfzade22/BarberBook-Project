const request = require("supertest");
const createApp = require("../src/app");
const connectDB = require("../src/config/database");
const dataStore = require("../src/services/dataStore");
const mongoose = require("mongoose");

let app;

describe("Barber API Tests", () => {
  beforeAll(async () => {
    await connectDB();
    await dataStore.initialize();
    app = createApp();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/barbers", () => {
    it("should get all barbers", async () => {
      const response = await request(app).get("/api/barbers");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty("name");
      expect(response.body.data[0]).toHaveProperty("services");
      expect(response.body.data[0]).toHaveProperty("workingHours");
    });
  });

  describe("GET /api/barbers/:id", () => {
    it("should get barber by valid ID", async () => {
      const response = await request(app).get("/api/barbers/1");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id", "1");
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("services");
    });

    it("should return 404 for non-existent barber", async () => {
      const response = await request(app).get("/api/barbers/999");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/barbers/:id/availability", () => {
    it("should get barber availability for a date", async () => {
      const date = "2025-12-15";
      const response = await request(app)
        .get("/api/barbers/1/availability")
        .query({ date });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("barberId", "1");
      expect(response.body.data).toHaveProperty("date", date);
      expect(response.body.data).toHaveProperty("workingHours");
      expect(response.body.data).toHaveProperty("bookedSlots");
      expect(Array.isArray(response.body.data.bookedSlots)).toBe(true);
    });

    it("should fail without date parameter", async () => {
      const response = await request(app).get("/api/barbers/1/availability");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
