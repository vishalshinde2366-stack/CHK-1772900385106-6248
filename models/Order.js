const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
productId:String,
customerId:String,
status:String
});

module.exports = mongoose.model("Order",OrderSchema);