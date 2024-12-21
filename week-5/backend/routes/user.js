//  start writing your code from here
const { Router } = require("express");
const userRouter = Router();
const { User } = require("../db/index");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret";
const bcrypt = require("bcrypt");

//signin
userRouter.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    username,
  });

  if (user) {
    res.json({
      message: "There is a user with this name ",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
    });

    res.json({
      message: "You have signed up",
    });
  } catch (e) {
    res.json({
      message: "Something went wrong",
      e,
    });
  }
});

//signup
userRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      username,
    });

    if (!user) {
      res.json({
        message: "Incorrect credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        message: "Incorrect credentials",
      });
    }

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET);

    res.json({
      token,
      message: "You are signed in!",
    });
  } catch (e) {
    res.json({
      message: "Server error",
      e,
    });
  }
});

module.exports = {
  userRouter,
};
