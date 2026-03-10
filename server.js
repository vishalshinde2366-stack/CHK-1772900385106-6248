const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/craftkart")
   .then(() => console.log("MongoDB Connected"))
   .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
   name: String,
   email: String,
   password: String,
   role: String
});

const User = mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema({
   name: String,
   price: Number,
   description: String,
   image: String,
   artisanName: String,
   artisanId: String
});

const Product = mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
   productName: String,
   productImage: String,
   price: Number,
   quantity: Number,
   artisanName: String,
   artisanId: String,
   customerId: String,
   paymentMethod: String
});

const Order = mongoose.model("Order", orderSchema);

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "uploads");
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
   }
});

const upload = multer({ storage: storage });

app.post("/api/auth/signup", async (req, res) => {
   try {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
         return res.json({ message: "User already exists" });
      }

      const user = new User({ name, email, password, role });

      await user.save();

      res.json({ message: "Signup successful" });

   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
   }
});

app.post("/api/auth/login", async (req, res) => {
   try {

      const { email, password } = req.body;

      const user = await User.findOne({ email, password });

      if (!user) {
         return res.json({ message: "Invalid email or password" });
      }

      res.json({
         message: "Login successful",
         userId: user._id,
         name: user.name,
         role: user.role
      });

   } catch (err) {

      console.log(err);
      res.status(500).json({ message: "Server error" });

   }
});

app.post("/api/products", upload.single("image"), async (req, res) => {

   try {

      const { name, price, description, artisanName, artisanId } = req.body;

      const product = new Product({
         name,
         price,
         description,
         image: "/uploads/" + req.file.filename,
         artisanName,
         artisanId
      });

      await product.save();

      res.json({ message: "Product added successfully" });

   } catch (err) {

      console.log(err);
      res.status(500).json({ message: "Server error" });

   }

});

app.get("/api/products", async (req, res) => {

   try {

      const products = await Product.find();
      res.json(products);

   } catch (err) {

      console.log(err);
      res.status(500).json({ message: "Server error" });

   }

});

app.delete("/api/products/:id", async (req, res) => {

   try {

      await Product.findByIdAndDelete(req.params.id);

      res.json({ message: "Product deleted" });

   } catch (err) {

      console.log(err);
      res.status(500).json({ message: "Server error" });

   }

});

app.post("/api/orders", async (req, res) => {

   try {

      const order = new Order(req.body);
      await order.save();

      res.json({ message: "Order saved successfully" });

   } catch (err) {

      console.log(err);
      res.status(500).json({ message: "Server error" });

   }

});

app.get("/api/orders/:customerId", async (req, res) => {

   try {

      const orders = await Order.find({ customerId: req.params.customerId });
      res.json(orders);

   } catch (err) {

      console.log(err);
      res.status(500).json({ message: "Server error" });

   }

});

const razorpay = new Razorpay({
   key_id: "rzp_test_SPZXZgTKtMhLAf",
   key_secret: "1eKGs3yQgJPMmZADu6eddVbH"
});

app.post("/create-order", async (req, res) => {

   try {

      const options = {
         amount: req.body.amount * 100,
         currency: "INR",
         receipt: "receipt_" + Date.now()
      };

      const order = await razorpay.orders.create(options);

      res.json(order);

   } catch (err) {

      console.log(err);
      res.status(500).json({ message: "Razorpay error" });

   }

});

app.listen(5000, () => {
   console.log("Server running on http://localhost:5000");
});