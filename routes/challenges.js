const express = require("express");
const router = express.Router();
// const { someChallengeController } = require("../server/controllers/challenge"); // Uncomment and update when controller exists
const auth = require("../server/middlewares/auth");

// TODO: Add challenge-related routes here
// Example:
// router.post("/create", auth, someChallengeController);

module.exports = router;
