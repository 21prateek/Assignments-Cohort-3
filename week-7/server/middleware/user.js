const jwt = require("jsonwebtoken");
const JTW_SECRET = "SECRET"; // This should be in an environment variable in a real application

async function authMiddleware (req, res, next) => {
    //  authMiddleware logic here
  };

  module.exports={authMiddleware}