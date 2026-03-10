const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({

name: String,
price: Number,
description: String,
image: String,

artisanId: String,
artisanName: String

});

module.exports = mongoose.model("Product", ProductSchema);