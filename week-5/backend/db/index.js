//  start writing from here
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://prateekgurung21:u0CMcGFDnoA7YRgN@cluster0.pp8jm.mongodb.net/todo"
  )
  .then(() => console.log("Connected to MongoDB"));

const ObjectId = mongoose.ObjectId;

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const TodoSchema = new mongoose.Schema({
  userId: ObjectId,
  title: String,
  completed: Boolean,
});

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema);

module.exports = {
  User,
  Todo,
};
