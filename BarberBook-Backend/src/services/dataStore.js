const fs = require("fs").promises;
const path = require("path");

class DataStore {
  constructor() {
    this.dataDir = path.join(__dirname, "../data");
    this.users = [];
    this.barbers = [];
    this.appointments = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await this.loadUsers();
      await this.loadBarbers();
      await this.loadAppointments();
      this.initialized = true;
      console.log("✅ DataStore initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing DataStore:", error);
      throw error;
    }
  }

  async loadUsers() {
    const filePath = path.join(this.dataDir, "users.json");
    try {
      const data = await fs.readFile(filePath, "utf8");
      this.users = JSON.parse(data);
    } catch (error) {
      console.warn("Users file not found, initializing empty array");
      this.users = [];
      await this.saveUsers();
    }
  }

  async loadBarbers() {
    const filePath = path.join(this.dataDir, "barbers.json");
    try {
      const data = await fs.readFile(filePath, "utf8");
      this.barbers = JSON.parse(data);
    } catch (error) {
      console.warn("Barbers file not found, initializing empty array");
      this.barbers = [];
      await this.saveBarbers();
    }
  }

  async loadAppointments() {
    const filePath = path.join(this.dataDir, "appointments.json");
    try {
      const data = await fs.readFile(filePath, "utf8");
      this.appointments = JSON.parse(data);
    } catch (error) {
      console.warn("Appointments file not found, initializing empty array");
      this.appointments = [];
      await this.saveAppointments();
    }
  }

  async saveUsers() {
    const filePath = path.join(this.dataDir, "users.json");
    await fs.writeFile(filePath, JSON.stringify(this.users, null, 2), "utf8");
  }

  async saveBarbers() {
    const filePath = path.join(this.dataDir, "barbers.json");
    await fs.writeFile(filePath, JSON.stringify(this.barbers, null, 2), "utf8");
  }

  async saveAppointments() {
    const filePath = path.join(this.dataDir, "appointments.json");
    await fs.writeFile(
      filePath,
      JSON.stringify(this.appointments, null, 2),
      "utf8"
    );
  }

  getAllUsers() {
    return this.users;
  }

  findUserById(id) {
    return this.users.find((user) => user.id === id);
  }

  findUserByEmail(email) {
    return this.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData) {
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    await this.saveUsers();
    return newUser;
  }

  async updateUser(id, updates) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    this.users[index] = { ...this.users[index], ...updates };
    await this.saveUsers();
    return this.users[index];
  }

  async deleteUser(id) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    await this.saveUsers();
    return true;
  }

  getAllBarbers() {
    return this.barbers;
  }

  findBarberById(id) {
    return this.barbers.find((barber) => barber.id === id);
  }

  async createBarber(barberData) {
    const newBarber = {
      id: `${Date.now()}`,
      ...barberData,
    };
    this.barbers.push(newBarber);
    await this.saveBarbers();
    return newBarber;
  }

  async updateBarber(id, updates) {
    const index = this.barbers.findIndex((barber) => barber.id === id);
    if (index === -1) return null;

    this.barbers[index] = { ...this.barbers[index], ...updates };
    await this.saveBarbers();
    return this.barbers[index];
  }

  getAllAppointments() {
    return this.appointments;
  }

  findAppointmentById(id) {
    return this.appointments.find((apt) => apt.id === id);
  }

  findAppointmentsByCustomerId(customerId) {
    return this.appointments.filter((apt) => apt.customerId === customerId);
  }

  findAppointmentsByBarberId(barberId) {
    return this.appointments.filter((apt) => apt.barberId === barberId);
  }

  findAppointmentsByDateAndBarber(date, barberId) {
    return this.appointments.filter(
      (apt) => apt.date === date && apt.barberId === barberId
    );
  }

  isTimeSlotAvailable(barberId, date, time, duration) {
    const existingAppointments = this.findAppointmentsByDateAndBarber(
      date,
      barberId
    );

    const [hours, minutes] = time.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;

    for (const apt of existingAppointments) {
      if (apt.status === "cancelled") continue;

      const [aptHours, aptMinutes] = apt.time.split(":").map(Number);
      const aptStartMinutes = aptHours * 60 + aptMinutes;
      const aptEndMinutes = aptStartMinutes + apt.duration;

      if (
        (startMinutes >= aptStartMinutes && startMinutes < aptEndMinutes) ||
        (endMinutes > aptStartMinutes && endMinutes <= aptEndMinutes) ||
        (startMinutes <= aptStartMinutes && endMinutes >= aptEndMinutes)
      ) {
        return false;
      }
    }

    return true;
  }

  async createAppointment(appointmentData) {
    const isAvailable = this.isTimeSlotAvailable(
      appointmentData.barberId,
      appointmentData.date,
      appointmentData.time,
      appointmentData.duration
    );

    if (!isAvailable) {
      throw new Error("Time slot is not available");
    }

    const newAppointment = {
      id: `appt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...appointmentData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    this.appointments.push(newAppointment);
    await this.saveAppointments();
    return newAppointment;
  }

  async updateAppointment(id, updates) {
    const index = this.appointments.findIndex((apt) => apt.id === id);
    if (index === -1) return null;

    this.appointments[index] = { ...this.appointments[index], ...updates };
    await this.saveAppointments();
    return this.appointments[index];
  }

  async cancelAppointment(id) {
    return await this.updateAppointment(id, { status: "cancelled" });
  }

  async deleteAppointment(id) {
    const index = this.appointments.findIndex((apt) => apt.id === id);
    if (index === -1) return false;

    this.appointments.splice(index, 1);
    await this.saveAppointments();
    return true;
  }
}

const dataStore = new DataStore();

module.exports = dataStore;
