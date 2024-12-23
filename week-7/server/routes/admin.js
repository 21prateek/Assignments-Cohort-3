const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const JTW_SECRET = "SECRET"; // This should be in an environment variable in a real application

// Admin routes
adminRouter.post("/admin/signup", (req, res) => {
  // logic to sign up admin
});

adminRouter.post("/admin/login", (req, res) => {
  // logic to log in admin
});

adminRouter.post("/admin/courses", (req, res) => {
  // logic to create a course
});

adminRouter.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
});

adminRouter.get("/admin/courses", (req, res) => {
  // logic to get all courses
});

module.exports = { adminRouter };
