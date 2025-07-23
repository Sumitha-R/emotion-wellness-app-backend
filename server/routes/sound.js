const express = require('express');
const router = express.Router();
const soundController = require('../controllers/soundController');

router.post('/', soundController.addSound);
router.get('/', soundController.getSounds);

module.exports = router; 