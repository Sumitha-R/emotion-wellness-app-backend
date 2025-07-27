const express = require('express');
const router = express.Router();
const soundController = require('../controllers/soundController');

// Sound therapy routes
router.post('/', soundController.addSoundTherapy);
router.get('/', soundController.getAllSoundTherapies);
router.get('/:id', soundController.getSoundTherapyById);
router.post('/:id/play', soundController.playSoundTherapy);
router.post('/recommendations/benefits', soundController.getRecommendationsByBenefits);
router.get('/type/:type', soundController.getSoundTherapiesByType);

module.exports = router; 