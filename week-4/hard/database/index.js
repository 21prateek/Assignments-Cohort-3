const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://prateekgurung21:VTvMm6WAV28Cy9Z9@cluster0.pp8jm.mongodb.net/Todo"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define schemas
const ObjectId = mongoose.ObjectId;

const UserSchema = new mongoose.Schema({
  // Schema definition here
  username: String,
  password: String,
});

const TodoSchema = new mongoose.Schema({
  // Schema definition here
  userId: ObjectId,
  title: String,
  done: Boolean,
});

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema);

module.exports = {
  User,
  Todo,
};
