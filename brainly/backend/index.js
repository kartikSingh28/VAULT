const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("Starting server...");
const { UserRouter } = require("./user");
console.log("UserRouter loaded:", UserRouter);
const { MONGO_URL } = require("./config");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

console.log("Registering /api/v1 routes...");
app.use("/api/v1", UserRouter);
console.log("Routes registered");

// 404 handler
app.use((req, res) => {
  console.log(`Not found: ${req.method} ${req.path}`);
  res.status(404).json({ message: "Route not found", path: req.path });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
