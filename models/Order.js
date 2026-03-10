const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

productName:String,
productImage:String,
price:Number,
quantity:Number,

artisanName:String,
artisanId:String,

customerId:String

});

module.exports = mongoose.model("Order", OrderSchema);