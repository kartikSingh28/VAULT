const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { UserRouter } = require("./user");
const { MONGO_URL } = require("./config");

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req: any, res: any) => {
  res.send("Hello, world!");
});

app.use("/api/v1", UserRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});