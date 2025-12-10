const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsCalendar,
} = require("../controllers/appointmentController");
const {
  authenticate,
  isCustomer,
  isBarber,
  isCustomerOrBarber,
} = require("../middleware/auth");
const validate = require("../middleware/validate");

router.post(
  "/",
  authenticate,
  isCustomer,
  [
    body("barberId").notEmpty().withMessage("Barber ID is required"),
    body("serviceId").notEmpty().withMessage("Service ID is required"),
    body("date")
      .notEmpty()
      .withMessage("Date is required")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Date must be in YYYY-MM-DD format"),
    body("time")
      .notEmpty()
      .withMessage("Time is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("Time must be in HH:MM format"),
    body("duration")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Duration must be a positive integer"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    validate,
  ],
  createAppointment
);

router.get("/", authenticate, isCustomerOrBarber, getAppointments);

router.get(
  "/calendar",
  authenticate,
  isBarber,
  [
    query("startDate")
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Start date must be in YYYY-MM-DD format"),
    query("endDate")
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("End date must be in YYYY-MM-DD format"),
    validate,
  ],
  getAppointmentsCalendar
);

router.get("/:id", authenticate, isCustomerOrBarber, getAppointmentById);

router.put(
  "/:id",
  authenticate,
  isCustomerOrBarber,
  [
    body("status")
      .optional()
      .isIn(["confirmed", "cancelled", "completed"])
      .withMessage("Status must be confirmed, cancelled, or completed"),
    body("notes").optional(),
    validate,
  ],
  updateAppointment
);

router.delete("/:id", authenticate, isCustomer, deleteAppointment);

module.exports = router;
