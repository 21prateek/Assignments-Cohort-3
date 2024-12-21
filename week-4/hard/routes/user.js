const { Router } = require("express");
const userRouter = Router();
const userMiddleware = require("../middleware/user");
const { User, Todo } = require("../database/index");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "SECRET_USER";
const bcrypt = require("bcrypt");

// User Routes
userRouter.post("/signup", async (req, res) => {
  // Implement user signup logic
  const username = req.body.username;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    await User.create({
      username: username,
      password: hashedPassword,
    });

    res.json({
      message: "We have create the user",
    });
  } catch (e) {
    res.json({
      message: "User already exist or something went wrong",
    });
  }
});

userRouter.post("/login", async (req, res) => {
  // Implement user login logic
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      username,
    });

    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed passwords

    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET);

    // Send the token and a success message
    res.json({ token, message: "You are signed in!" });
  } catch (e) {
    res.json({
      message: "Server error",
      e,
    });
  }
});

userRouter.get("/todos", userMiddleware, async (req, res) => {
  // Implement logic for getting todos for a user
  try {
    const todos = await Todo.find({
      userId: req.userId,
    });

    return res.json({
      todos,
    });
  } catch (e) {
    return res.json({
      message: "Error in fetching todo",
      e,
    });
  }
});

userRouter.post("/logout", userMiddleware, (req, res) => {
  // Implement logout logic
});

module.exports = {
  userRouter,
};
