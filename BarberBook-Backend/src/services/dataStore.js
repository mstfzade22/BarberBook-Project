const User = require("../models/User");
const Barber = require("../models/Barber");
const Appointment = require("../models/Appointment");

class DataStore {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    this.initialized = true;
    console.log("✅ MongoDB DataStore initialized successfully");
  }

  async getAllUsers() {
    return await User.find().select("-passwordHash");
  }

  async findUserById(id) {
    return await User.findById(id).select("-passwordHash");
  }

  async findUserByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async createUser(userData) {
    const newUser = new User({
      ...userData,
      email: userData.email.toLowerCase(),
    });
    await newUser.save();
    const userObj = newUser.toObject();
    delete userObj.passwordHash;
    return userObj;
  }

  async updateUser(id, updates) {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-passwordHash");
    return user;
  }

  async deleteUser(id) {
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  }

  async getAllBarbers() {
    return await Barber.find().populate("userId", "name email phone");
  }

  async findBarberById(id) {
    return await Barber.findById(id).populate("userId", "name email phone");
  }

  async findBarberByUserId(userId) {
    return await Barber.findOne({ userId }).populate("userId", "name email phone");
  }

  async createBarber(barberData) {
    const newBarber = new Barber(barberData);
    await newBarber.save();
    return newBarber.populate("userId", "name email phone");
  }

  async updateBarber(id, updates) {
    const barber = await Barber.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("userId", "name email phone");
    return barber;
  }

  async getAllAppointments() {
    return await Appointment.find()
      .populate("customerId", "name email phone")
      .populate("barberId", "name specialization profileImage");
  }

  async findAppointmentById(id) {
    return await Appointment.findById(id)
      .populate("customerId", "name email phone")
      .populate("barberId", "name specialization profileImage");
  }

  async findAppointmentsByCustomerId(customerId) {
    return await Appointment.find({ customerId })
      .populate("customerId", "name email phone")
      .populate("barberId", "name specialization profileImage services")
      .sort({ date: -1, time: -1 });
  }

  async findAppointmentsByBarberId(barberId) {
    return await Appointment.find({ barberId })
      .populate("customerId", "name email phone")
      .populate("barberId", "name specialization profileImage services")
      .sort({ date: -1, time: -1 });
  }

  async findAppointmentsByDateAndBarber(date, barberId) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await Appointment.find({
      barberId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
  }

  async isTimeSlotAvailable(barberId, date, time, duration) {
    const existingAppointments = await this.findAppointmentsByDateAndBarber(
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
    const isAvailable = await this.isTimeSlotAvailable(
      appointmentData.barberId,
      appointmentData.date,
      appointmentData.time,
      appointmentData.duration
    );

    if (!isAvailable) {
      throw new Error("Time slot is not available");
    }

    const newAppointment = new Appointment({
      ...appointmentData,
      status: "confirmed",
    });

    await newAppointment.save();
    return newAppointment.populate([
      { path: "customerId", select: "name email phone" },
      { path: "barberId", select: "name email phone" }
    ]);
  }

  async updateAppointment(id, updates) {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("customerId", "name email phone")
      .populate("barberId", "name email phone");
    return appointment;
  }

  async cancelAppointment(id) {
    return await this.updateAppointment(id, { status: "cancelled" });
  }

  async deleteAppointment(id) {
    const result = await Appointment.findByIdAndDelete(id);
    return result !== null;
  }
}

const dataStore = new DataStore();

module.exports = dataStore;
