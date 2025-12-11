const request = require("supertest");
const createApp = require("../src/app");
const connectDB = require("../src/config/database");
const dataStore = require("../src/services/dataStore");
const mongoose = require("mongoose");

let app;
let customerToken;
let barberToken;

describe("Appointment API Tests", () => {
  beforeAll(async () => {
    await connectDB();
    await dataStore.initialize();
    app = createApp();

    const customerRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Customer",
        email: `customer${Date.now()}@test.com`,
        password: "password123",
        role: "customer",
      });
    customerToken = customerRes.body.data.token;

    const barberRes = await request(app).post("/api/auth/register").send({
      name: "Test Barber",
      email: `barber${Date.now()}@test.com`,
      password: "password123",
      role: "barber",
      phone: "+1234567890",
    });
    barberToken = barberRes.body.data.token;
  });

  describe.skip("POST /api/appointments", () => {
    it("should create appointment with valid data", async () => {
      const response = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          barberId: "1",
          serviceId: "s1",
          date: "2025-12-25",
          time: "10:00",
          duration: 30,
          price: 25,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("barberId", "1");
      expect(response.body.data).toHaveProperty("status", "confirmed");
    });

    it("should fail without authentication", async () => {
      const response = await request(app).post("/api/appointments").send({
        barberId: "1",
        serviceId: "s1",
        date: "2025-12-25",
        time: "11:00",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid date format", async () => {
      const response = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          barberId: "1",
          serviceId: "s1",
          date: "12/25/2025", // Invalid format
          time: "10:00",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail with conflicting time slot", async () => {
      const appointmentData = {
        barberId: "1",
        serviceId: "s1",
        date: "2025-12-26",
        time: "14:00",
        duration: 30,
        price: 25,
      };

      await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(appointmentData);

      const response = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(appointmentData);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already booked");
    });

    it("should fail with non-existent barber", async () => {
      const response = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          barberId: "999",
          serviceId: "s1",
          date: "2025-12-25",
          time: "10:00",
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe.skip("GET /api/appointments", () => {
    it("should get customer appointments", async () => {
      const response = await request(app)
        .get("/api/appointments")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should get barber appointments", async () => {
      const response = await request(app)
        .get("/api/appointments")
        .set("Authorization", `Bearer ${barberToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should fail without authentication", async () => {
      const response = await request(app).get("/api/appointments");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe.skip("GET /api/appointments/calendar", () => {
    it("should get barber calendar view", async () => {
      const response = await request(app)
        .get("/api/appointments/calendar")
        .set("Authorization", `Bearer ${barberToken}`)
        .query({
          startDate: "2025-12-01",
          endDate: "2025-12-31",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(typeof response.body.data).toBe("object");
    });

    it("should fail for non-barber users", async () => {
      const response = await request(app)
        .get("/api/appointments/calendar")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe.skip("PUT /api/appointments/:id", () => {
    let appointmentId;

    beforeAll(async () => {
      const res = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          barberId: "1",
          serviceId: "s1",
          date: "2025-12-27",
          time: "15:00",
          duration: 30,
          price: 25,
        });
      appointmentId = res.body.data.id;
    });

    it("should update appointment status", async () => {
      const response = await request(app)
        .put(`/api/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          status: "cancelled",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("cancelled");
    });

    it("should fail with invalid status", async () => {
      const response = await request(app)
        .put(`/api/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          status: "invalid_status",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe.skip("DELETE /api/appointments/:id", () => {
    let appointmentId;

    beforeAll(async () => {
      const res = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          barberId: "1",
          serviceId: "s1",
          date: "2025-12-28",
          time: "16:00",
          duration: 30,
          price: 25,
        });
      appointmentId = res.body.data.id;
    });

    it("should delete appointment", async () => {
      const response = await request(app)
        .delete(`/api/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should fail for non-existent appointment", async () => {
      const response = await request(app)
        .delete("/api/appointments/non_existent_id")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
