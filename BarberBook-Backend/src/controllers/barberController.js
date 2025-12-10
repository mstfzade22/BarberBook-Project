const dataStore = require("../services/dataStore");
const { successResponse, errorResponse } = require("../utils/response");

const getAllBarbers = async (req, res) => {
  try {
    const barbers = dataStore.getAllBarbers();

    return successResponse(res, 200, "Barbers retrieved successfully", barbers);
  } catch (error) {
    console.error("Get all barbers error:", error);
    return errorResponse(res, 500, "Error retrieving barbers");
  }
};

const getBarberById = async (req, res) => {
  try {
    const { id } = req.params;
    const barber = dataStore.findBarberById(id);

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

    const barber = dataStore.findBarberById(id);
    if (!barber) {
      return errorResponse(res, 404, "Barber not found");
    }

    const appointments = dataStore.findAppointmentsByDateAndBarber(date, id);

    const bookedSlots = appointments
      .filter((apt) => apt.status !== "cancelled")
      .map((apt) => ({
        time: apt.time,
        duration: apt.duration,
      }));

    return successResponse(res, 200, "Availability retrieved successfully", {
      barberId: id,
      date,
      workingHours: barber.workingHours,
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
