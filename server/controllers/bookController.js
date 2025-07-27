const BookRecommendation = require('../models/BookRecommendation');

// Add new book recommendation
exports.addBookRecommendation = async (req, res) => {
  try {
    const bookData = req.body;
    const newBook = new BookRecommendation(bookData);
    await newBook.save();
    
    res.status(201).json({ 
      message: 'Book recommendation added successfully', 
      book: newBook 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to add book recommendation', 
      error: error.message 
    });
  }
};

// Get all book recommendations with filtering
exports.getAllBookRecommendations = async (req, res) => {
  try {
    const { type, focus, mood, difficulty, is_free } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (focus) query.therapeutic_focus = { $in: focus.split(',') };
    if (difficulty) query.difficulty_level = difficulty;
    if (is_free !== undefined) query.is_free = is_free === 'true';
    
    let books;
    if (mood) {
      books = await BookRecommendation.getRecommendedByMood(mood);
    } else {
      books = await BookRecommendation.find(query).sort({ rating: -1, read_count: -1 });
    }
    
    res.status(200).json({ 
      books,
      count: books.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch book recommendations', 
      error: error.message 
    });
  }
};

// Get book recommendation by ID
exports.getBookRecommendationById = async (req, res) => {
  try {
    const book = await BookRecommendation.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book recommendation not found' });
    }
    
    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch book recommendation', 
      error: error.message 
    });
  }
};

// Track book read (increment read count)
exports.trackBookRead = async (req, res) => {
  try {
    const book = await BookRecommendation.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book recommendation not found' });
    }
    
    await book.incrementReadCount();
    
    res.status(200).json({ 
      message: 'Read count updated',
      book: book
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update read count', 
      error: error.message 
    });
  }
};

// Get books by therapeutic focus
exports.getBooksByTherapeuticFocus = async (req, res) => {
  try {
    const { focus } = req.body;
    
    if (!focus || !Array.isArray(focus)) {
      return res.status(400).json({ message: 'Therapeutic focus array is required' });
    }
    
    const books = await BookRecommendation.getByTherapeuticFocus(focus);
    
    res.status(200).json({ 
      recommendations: books,
      count: books.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get book recommendations', 
      error: error.message 
    });
  }
};

// Get books by type
exports.getBooksByType = async (req, res) => {
  try {
    const { type } = req.params;
    const books = await BookRecommendation.getByType(type);
    
    res.status(200).json({ 
      books,
      type,
      count: books.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch books by type', 
      error: error.message 
    });
  }
};

// Search books by author
exports.searchBooksByAuthor = async (req, res) => {
  try {
    const { author } = req.query;
    
    if (!author) {
      return res.status(400).json({ message: 'Author name is required' });
    }
    
    const books = await BookRecommendation.find({
      author: new RegExp(author, 'i')
    }).sort({ rating: -1 });
    
    res.status(200).json({ 
      books,
      author,
      count: books.length 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to search books by author', 
      error: error.message 
    });
  }
};

module.exports = exports;
