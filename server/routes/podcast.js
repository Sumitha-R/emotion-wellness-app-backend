const express = require('express');
const router = express.Router();
const podcastController = require('../controllers/podcastController');

// Therapy podcast routes
router.post('/', podcastController.addTherapyPodcast);
router.get('/', podcastController.getAllTherapyPodcasts);
router.get('/:id', podcastController.getTherapyPodcastById);
router.post('/:id/listen', podcastController.trackPodcastListen);
router.post('/recommendations/focus', podcastController.getPodcastsByTherapeuticFocus);
router.get('/type/:type', podcastController.getPodcastsByType);
router.get('/host/:host', podcastController.getPodcastsByHost);
router.get('/season/:season', podcastController.getPodcastsBySeason);

module.exports = router;
