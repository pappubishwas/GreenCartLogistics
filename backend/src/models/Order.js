const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  order_id: { type: Number, required: true, unique: true },
  value_rs: { type: Number, required: true },
  route_id: { type: Number, required: true },
  delivery_time: { type: String, required: true } 
});

module.exports = mongoose.model('Order', OrderSchema);
