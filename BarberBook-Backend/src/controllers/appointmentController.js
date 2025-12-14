const dataStore = require("../services/dataStore");
const { successResponse, errorResponse } = require("../utils/response");

const createAppointment = async (req, res) => {
  try {
    const { barberId, serviceId, date, time, duration, price, notes } =
      req.body;
    const customerId = req.user.id;

    const barber = await dataStore.findBarberById(barberId);
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
      appointments = await dataStore.findAppointmentsByCustomerId(req.user.id);
    } else if (req.user.role === "barber") {
      // Find the barber document using the user's ID
      const barber = await dataStore.findBarberByUserId(req.user.id);

      if (!barber) {
        return errorResponse(res, 404, "Barber profile not found");
      }

      // Get appointments using both the barber's document ID and user ID
      // (to handle appointments created with either ID)
      appointments = await dataStore.findAppointmentsByBarberIdOrUserId(
        barber._id.toString(),
        req.user.id
      );
    } else {
      return errorResponse(res, 403, "Invalid user role");
    }

    const enrichedAppointments = appointments.map((apt) => {
      const aptObj = apt.toObject ? apt.toObject() : apt;

      // Get barber info from populated barberId
      const barberInfo = aptObj.barberId;
      const customerInfo = aptObj.customerId;

      // Find service name from barber's services array
      let serviceName = aptObj.serviceId;
      if (
        barberInfo &&
        barberInfo.services &&
        Array.isArray(barberInfo.services)
      ) {
        const service = barberInfo.services.find(
          (s) => s.id === aptObj.serviceId
        );
        if (service) {
          serviceName = service.name;
        }
      }

      return {
        ...aptObj,
        id: aptObj._id ? aptObj._id.toString() : aptObj.id, // Add id for frontend compatibility
        barberName: barberInfo && barberInfo.name ? barberInfo.name : "Unknown",
        barberSpecialization:
          barberInfo && barberInfo.specialization
            ? barberInfo.specialization
            : "",
        serviceName: serviceName,
        customerName:
          customerInfo && customerInfo.name ? customerInfo.name : "Unknown",
        customerEmail:
          customerInfo && customerInfo.email ? customerInfo.email : "",
        customerPhone:
          customerInfo && customerInfo.phone ? customerInfo.phone : "",
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
    const appointment = await dataStore.findAppointmentById(id);

    if (!appointment) {
      return errorResponse(res, 404, "Appointment not found");
    }

    const aptObj = appointment.toObject ? appointment.toObject() : appointment;
    const customerIdStr = aptObj.customerId._id
      ? aptObj.customerId._id.toString()
      : aptObj.customerId.toString();
    const barberIdStr = aptObj.barberId._id
      ? aptObj.barberId._id.toString()
      : aptObj.barberId
      ? aptObj.barberId.toString()
      : null;

    if (
      (req.user.role === "customer" && customerIdStr !== req.user.id) ||
      (req.user.role === "barber" && barberIdStr !== req.user.barberId)
    ) {
      return errorResponse(res, 403, "Not authorized to view this appointment");
    }

    const barberInfo = aptObj.barberId;
    const customerInfo = aptObj.customerId;

    const enrichedAppointment = {
      ...aptObj,
      barberName: barberInfo && barberInfo.name ? barberInfo.name : "Unknown",
      barberLocation:
        barberInfo && barberInfo.specialization
          ? barberInfo.specialization
          : "",
      customerName:
        customerInfo && customerInfo.name ? customerInfo.name : "Unknown",
      customerEmail:
        customerInfo && customerInfo.email ? customerInfo.email : "",
      customerPhone:
        customerInfo && customerInfo.phone ? customerInfo.phone : "",
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

    const appointment = await dataStore.findAppointmentById(id);

    if (!appointment) {
      return errorResponse(res, 404, "Appointment not found");
    }

    // Compare IDs properly (could be ObjectId, populated object, or string)
    const appointmentCustomerId =
      appointment.customerId?._id?.toString() ||
      appointment.customerId?.toString() ||
      appointment.customerId;
    const appointmentBarberId =
      appointment.barberId?._id?.toString() ||
      appointment.barberId?.toString() ||
      appointment.barberId;

    if (
      (req.user.role === "customer" && appointmentCustomerId !== req.user.id) ||
      (req.user.role === "barber" && appointmentBarberId !== req.user.barberId)
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
    const appointment = await dataStore.findAppointmentById(id);

    if (!appointment) {
      return errorResponse(res, 404, "Appointment not found");
    }

    // Compare customerId properly (could be ObjectId, populated object, or string)
    const appointmentCustomerId =
      appointment.customerId?._id?.toString() ||
      appointment.customerId?.toString() ||
      appointment.customerId;
    if (appointmentCustomerId !== req.user.id) {
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

    // Find the barber document using the user's ID
    const barber = await dataStore.findBarberByUserId(req.user.id);

    if (!barber) {
      return errorResponse(res, 404, "Barber profile not found");
    }

    // Get appointments using both the barber's document ID and user ID
    const appointments = await dataStore.findAppointmentsByBarberIdOrUserId(
      barber._id.toString(),
      req.user.id
    );

    let filteredAppointments = appointments;
    if (startDate && endDate) {
      filteredAppointments = appointments.filter((apt) => {
        return apt.date >= startDate && apt.date <= endDate;
      });
    }

    const calendar = {};
    for (const apt of filteredAppointments) {
      if (!calendar[apt.date]) {
        calendar[apt.date] = [];
      }

      const customer = await dataStore.findUserById(apt.customerId);

      calendar[apt.date].push({
        id: apt._id || apt.id,
        time: apt.time,
        duration: apt.duration,
        customerName: customer ? customer.name : "Unknown",
        customerPhone: customer ? customer.phone : "",
        serviceId: apt.serviceId,
        status: apt.status,
        price: apt.price,
      });
    }

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
