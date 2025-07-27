const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Book recommendation routes
router.post('/', bookController.addBookRecommendation);
router.get('/', bookController.getAllBookRecommendations);
router.get('/:id', bookController.getBookRecommendationById);
router.post('/:id/read', bookController.trackBookRead);
router.post('/recommendations/focus', bookController.getBooksByTherapeuticFocus);
router.get('/type/:type', bookController.getBooksByType);
router.get('/search/author', bookController.searchBooksByAuthor);

module.exports = router;
