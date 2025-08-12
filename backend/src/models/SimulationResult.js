const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SimulationResultSchema = new Schema({
  inputs: { type: Object, required: true },
  kpis: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SimulationResult', SimulationResultSchema);
