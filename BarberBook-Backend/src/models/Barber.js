const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  profileImage: {
    type: String,
    trim: true
  },
  services: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 5
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      trim: true
    }
  }],
  availability: [{
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Use HH:mm']
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Use HH:mm']
    }
  }],
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

barberSchema.index({ userId: 1 }, { unique: true });
barberSchema.index({ rating: -1 });
barberSchema.index({ specialization: 1 });

module.exports = mongoose.model('Barber', barberSchema);
