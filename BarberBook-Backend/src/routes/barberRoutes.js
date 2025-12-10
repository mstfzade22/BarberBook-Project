const express = require("express");
const router = express.Router();
const { query } = require("express-validator");
const {
  getAllBarbers,
  getBarberById,
  getBarberAvailability,
} = require("../controllers/barberController");
const validate = require("../middleware/validate");

router.get("/", getAllBarbers);

router.get("/:id", getBarberById);

router.get(
  "/:id/availability",
  [query("date").notEmpty().withMessage("Date is required"), validate],
  getBarberAvailability
);

module.exports = router;
