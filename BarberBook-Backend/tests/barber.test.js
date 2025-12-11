const request = require("supertest");
const createApp = require("../src/app");
const connectDB = require("../src/config/database");
const dataStore = require("../src/services/dataStore");
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Barber = require("../src/models/Barber");

let app;
let testBarberId;
let testUserId;

describe("Barber API Tests", () => {
  beforeAll(async () => {
    await connectDB();
    await dataStore.initialize();
    app = createApp();

    // Create a test user and barber for testing
    const testUser = await User.create({
      name: "Test Barber User",
      email: `testbarber${Date.now()}@test.com`,
      passwordHash: "$2a$10$abcdefghijklmnopqrstuv", // dummy hash
      phone: "+1234567890",
      role: "barber"
    });
    testUserId = testUser._id;

    const testBarber = await Barber.create({
      userId: testUserId,
      name: "Test Barber",
      specialization: "Hair Styling",
      experience: 5,
      rating: 4.5,
      services: [
        { id: "s1", name: "Haircut", duration: 30, price: 25 }
      ],
      availability: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }
      ]
    });
    testBarberId = testBarber._id.toString();
  });

  afterAll(async () => {
    // Clean up test data
    if (testBarberId) await Barber.findByIdAndDelete(testBarberId);
    if (testUserId) await User.findByIdAndDelete(testUserId);
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
      expect(response.body.data[0]).toHaveProperty("availability");
    });
  });

  describe("GET /api/barbers/:id", () => {
    it("should get barber by valid ID", async () => {
      const response = await request(app).get(`/api/barbers/${testBarberId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("services");
    });

    it("should return 404 for non-existent barber", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/barbers/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/barbers/:id/availability", () => {
    it("should get barber availability for a date", async () => {
      const date = "2025-12-15";
      const response = await request(app)
        .get(`/api/barbers/${testBarberId}/availability`)
        .query({ date });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("date", date);
      expect(response.body.data).toHaveProperty("workingHours");
      expect(response.body.data).toHaveProperty("bookedSlots");
      expect(Array.isArray(response.body.data.bookedSlots)).toBe(true);
    });

    it("should fail without date parameter", async () => {
      const response = await request(app).get(`/api/barbers/${testBarberId}/availability`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
