const request = require("supertest");
const createApp = require("../src/app");
const dataStore = require("../src/services/dataStore");

let app;

describe("Auth API Tests", () => {
  beforeAll(async () => {
    await dataStore.initialize();
    app = createApp();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new customer successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test Customer",
          email: `test${Date.now()}@test.com`,
          password: "password123",
          phone: "+1234567890",
          role: "customer",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user.email).toContain("@test.com");
      expect(response.body.data.user).not.toHaveProperty("passwordHash");
    });

    it("should fail with duplicate email", async () => {
      const email = `duplicate${Date.now()}@test.com`;

      await request(app).post("/api/auth/register").send({
        name: "User One",
        email,
        password: "password123",
      });

      const response = await request(app).post("/api/auth/register").send({
        name: "User Two",
        email,
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");
    });

    it("should fail with invalid email", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it("should fail with short password", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@test.com",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      await request(app).post("/api/auth/register").send({
        name: "Login Test User",
        email: "logintest@test.com",
        password: "password123",
      });
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "logintest@test.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user).not.toHaveProperty("passwordHash");
    });

    it("should fail with incorrect password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "logintest@test.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should fail with non-existent email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@test.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    let token;
    let testEmail;

    beforeAll(async () => {
      testEmail = `metest${Date.now()}@test.com`;
      const response = await request(app).post("/api/auth/register").send({
        name: "Me Test User",
        email: testEmail,
        password: "password123",
      });

      token = response.body.data.token;
    });

    it("should get current user with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testEmail);
    });

    it("should fail without token", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalidtoken123");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
