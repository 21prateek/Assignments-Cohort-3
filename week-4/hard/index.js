const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const { userRouter } = require("./routes/user");
const { todoRouter } = require("./routes/todo");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://prateekgurung21:VTvMm6WAV28Cy9Z9@cluster0.pp8jm.mongodb.net/Todo"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

//  start writing your routes here
app.use("/user", userRouter);
app.use("/todo", todoRouter);

app.listen(port, () =>
  console.log(`server is running at http://localhost:${port}`)
);
