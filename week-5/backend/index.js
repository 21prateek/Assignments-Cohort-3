const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { userRouter } = require("./routes/user");
const { todoRouter } = require("./routes/todo");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://prateekgurung21:u0CMcGFDnoA7YRgN@cluster0.pp8jm.mongodb.net/todo"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//  start writing your routes here
app.use("/user", userRouter);
app.use("/todo", todoRouter);

app.listen(port, () =>
  console.log(`server is running at http://localhost:${port}`)
);
