//  TODO: Can you create backend with standard folder structure like: week-4/hard ???
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const port = 3000;

const authMiddleware = (req, res, next) => {
  //  authMiddleware logic here
};

// Connect to MongoDB
mongoose.connect("<YourMongoDbConnectionString>");

app.listen(port, () => {
  console.log("Server is listening on port 3000");
});
