const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { addJournal } = require("../controllers/journal");

router.post("/add", auth, addJournal);

module.exports = router; 