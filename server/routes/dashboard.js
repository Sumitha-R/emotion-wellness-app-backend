const express = require('express');
const router = express.Router();
const { getMoodGraph } = require('../controllers/dashboard');
const auth = require('../middlewares/auth');

router.get('/mood-graph', auth, getMoodGraph);

module.exports = router; 