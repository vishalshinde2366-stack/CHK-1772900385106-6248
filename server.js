const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/artisanDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/products", require("./routes/product.js"));
app.use("/api/orders", require("./routes/orders"));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});