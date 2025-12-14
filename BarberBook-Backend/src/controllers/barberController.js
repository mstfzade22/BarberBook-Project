const dataStore = require("../services/dataStore");
const { successResponse, errorResponse } = require("../utils/response");

const getAllBarbers = async (req, res) => {
  try {
    const barbers = await dataStore.getAllBarbers();

    return successResponse(res, 200, "Barbers retrieved successfully", barbers);
  } catch (error) {
    console.error("Get all barbers error:", error);
    return errorResponse(res, 500, "Error retrieving barbers");
  }
};

const getBarberById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find barber by their barber ID first
    let barber = await dataStore.findBarberById(id);

    // If not found, try to find by user ID (for when barber logs in with their user account)
    if (!barber) {
      barber = await dataStore.findBarberByUserId(id);
    }

    if (!barber) {
      return errorResponse(res, 404, "Barber not found");
    }

    return successResponse(res, 200, "Barber retrieved successfully", barber);
  } catch (error) {
    console.error("Get barber error:", error);
    return errorResponse(res, 500, "Error retrieving barber");
  }
};

const getBarberAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return errorResponse(res, 400, "Date parameter is required");
    }

    // Try to find barber by their barber ID first, then by user ID
    let barber = await dataStore.findBarberById(id);
    if (!barber) {
      barber = await dataStore.findBarberByUserId(id);
    }

    if (!barber) {
      return errorResponse(res, 404, "Barber not found");
    }

    // Use the actual barber ID for appointment queries
    const barberId = barber._id.toString();
    const appointments = await dataStore.findAppointmentsByDateAndBarber(
      date,
      barberId
    );

    const bookedSlots = appointments
      .filter((apt) => apt.status !== "cancelled")
      .map((apt) => ({
        time: apt.time,
        duration: apt.duration,
      }));

    // Default working hours if not set in database
    const defaultWorkingHours = {
      monday: "09:00-18:00",
      tuesday: "09:00-18:00",
      wednesday: "09:00-18:00",
      thursday: "09:00-18:00",
      friday: "09:00-20:00",
      saturday: "10:00-17:00",
      sunday: "Closed",
    };

    return successResponse(res, 200, "Availability retrieved successfully", {
      barberId: barberId,
      date,
      workingHours: barber.workingHours || defaultWorkingHours,
      bookedSlots,
    });
  } catch (error) {
    console.error("Get availability error:", error);
    return errorResponse(res, 500, "Error retrieving availability");
  }
};

module.exports = {
  getAllBarbers,
  getBarberById,
  getBarberAvailability,
};
