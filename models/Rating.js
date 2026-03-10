const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({

productId:String,
artisanId:String,
userId:String,

stars:Number,
comment:String

});

module.exports = mongoose.model("Rating",RatingSchema);