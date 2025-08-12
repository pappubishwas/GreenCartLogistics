const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
  name: { type: String, required: true },
  shift_hours: { type: Number, required: true },
  past_week_hours: { type: [Number], default: [] }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Driver', DriverSchema);
