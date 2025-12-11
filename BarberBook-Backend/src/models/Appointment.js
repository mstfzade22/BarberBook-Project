const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: [true, 'Barber ID is required']
  },
  serviceId: {
    type: String,
    required: [true, 'Service ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Use HH:mm']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [5, 'Duration must be at least 5 minutes']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'confirmed',
    required: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

appointmentSchema.index({ customerId: 1, date: 1 });
appointmentSchema.index({ barberId: 1, date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1, time: 1 });

appointmentSchema.pre('save', function(next) {
  if (typeof this.date === 'string') {
    this.date = new Date(this.date);
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
