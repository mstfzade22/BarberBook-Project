const dataStore = require("../services/dataStore");
const { successResponse, errorResponse } = require("../utils/response");

const createAppointment = async (req, res) => {
  try {
    const { barberId, serviceId, date, time, duration, price, notes } =
      req.body;
    const customerId = req.user.id;

    const barber = dataStore.findBarberById(barberId);
    if (!barber) {
      return errorResponse(res, 404, "Barber not found");
    }

    const service = barber.services.find((s) => s.id === serviceId);
    if (!service) {
      return errorResponse(res, 404, "Service not found for this barber");
    }

    const appointmentData = {
      barberId,
      customerId,
      serviceId,
      date,
      time,
      duration: duration || service.duration,
      price: price || service.price,
      notes: notes || "",
    };

    const appointment = await dataStore.createAppointment(appointmentData);

    return successResponse(
      res,
      201,
      "Appointment created successfully",
      appointment
    );
  } catch (error) {
    console.error("Create appointment error:", error);

    if (error.message === "Time slot is not available") {
      return errorResponse(res, 409, "Time slot is already booked");
    }

    return errorResponse(res, 500, "Error creating appointment");
  }
};

const getAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === "customer") {
      appointments = dataStore.findAppointmentsByCustomerId(req.user.id);
    } else if (req.user.role === "barber") {
      appointments = dataStore.findAppointmentsByBarberId(req.user.barberId);
    } else {
      return errorResponse(res, 403, "Invalid user role");
    }

    const enrichedAppointments = appointments.map((apt) => {
      const barber = dataStore.findBarberById(apt.barberId);
      const customer = dataStore.findUserById(apt.customerId);

      return {
        ...apt,
        barberName: barber ? barber.name : "Unknown",
        customerName: customer ? customer.name : "Unknown",
        customerEmail: customer ? customer.email : "",
        customerPhone: customer ? customer.phone : "",
      };
    });

    return successResponse(
      res,
      200,
      "Appointments retrieved successfully",
      enrichedAppointments
    );
  } catch (error) {
    console.error("Get appointments error:", error);
    return errorResponse(res, 500, "Error retrieving appointments");
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = dataStore.findAppointmentById(id);

    if (!appointment) {
      return errorResponse(res, 404, "Appointment not found");
    }

    if (
      (req.user.role === "customer" &&
        appointment.customerId !== req.user.id) ||
      (req.user.role === "barber" && appointment.barberId !== req.user.barberId)
    ) {
      return errorResponse(res, 403, "Not authorized to view this appointment");
    }

    const barber = dataStore.findBarberById(appointment.barberId);
    const customer = dataStore.findUserById(appointment.customerId);

    const enrichedAppointment = {
      ...appointment,
      barberName: barber ? barber.name : "Unknown",
      barberLocation: barber ? barber.location : "",
      customerName: customer ? customer.name : "Unknown",
      customerEmail: customer ? customer.email : "",
      customerPhone: customer ? customer.phone : "",
    };

    return successResponse(
      res,
      200,
      "Appointment retrieved successfully",
      enrichedAppointment
    );
  } catch (error) {
    console.error("Get appointment error:", error);
    return errorResponse(res, 500, "Error retrieving appointment");
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = dataStore.findAppointmentById(id);

    if (!appointment) {
      return errorResponse(res, 404, "Appointment not found");
    }

    if (
      (req.user.role === "customer" &&
        appointment.customerId !== req.user.id) ||
      (req.user.role === "barber" && appointment.barberId !== req.user.barberId)
    ) {
      return errorResponse(
        res,
        403,
        "Not authorized to update this appointment"
      );
    }

    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const updatedAppointment = await dataStore.updateAppointment(id, updates);

    return successResponse(
      res,
      200,
      "Appointment updated successfully",
      updatedAppointment
    );
  } catch (error) {
    console.error("Update appointment error:", error);
    return errorResponse(res, 500, "Error updating appointment");
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = dataStore.findAppointmentById(id);

    if (!appointment) {
      return errorResponse(res, 404, "Appointment not found");
    }

    if (appointment.customerId !== req.user.id) {
      return errorResponse(
        res,
        403,
        "Not authorized to delete this appointment"
      );
    }

    await dataStore.deleteAppointment(id);

    return successResponse(res, 200, "Appointment deleted successfully");
  } catch (error) {
    console.error("Delete appointment error:", error);
    return errorResponse(res, 500, "Error deleting appointment");
  }
};

const getAppointmentsCalendar = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const appointments = dataStore.findAppointmentsByBarberId(
      req.user.barberId
    );

    let filteredAppointments = appointments;
    if (startDate && endDate) {
      filteredAppointments = appointments.filter((apt) => {
        return apt.date >= startDate && apt.date <= endDate;
      });
    }

    const calendar = {};
    filteredAppointments.forEach((apt) => {
      if (!calendar[apt.date]) {
        calendar[apt.date] = [];
      }

      const customer = dataStore.findUserById(apt.customerId);

      calendar[apt.date].push({
        id: apt.id,
        time: apt.time,
        duration: apt.duration,
        customerName: customer ? customer.name : "Unknown",
        customerPhone: customer ? customer.phone : "",
        serviceId: apt.serviceId,
        status: apt.status,
        price: apt.price,
      });
    });

    return successResponse(
      res,
      200,
      "Calendar retrieved successfully",
      calendar
    );
  } catch (error) {
    console.error("Get calendar error:", error);
    return errorResponse(res, 500, "Error retrieving calendar");
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsCalendar,
};
