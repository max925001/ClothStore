import Book from '../models/book.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import cloudinary from 'cloudinary';


export const createBook = async (req, res) => {
  const { bookName, price, type, author, publication, isbn, description } = req.body;
  const files = req.files; // Array of files from multer

  if (!bookName || !price || !type || !author || !publication || !files || files.length < 1 || files.length > 5) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided, and 1–5 images are required' });
  }

  try {
    const bookImages = [];
    for (const file of files) {
      const cloudinaryResponse = await uploadOnCloudinary(file);
      if (!cloudinaryResponse) {
        return res.status(500).json({ success: false, message: 'Failed to upload one or more images' });
      }
      bookImages.push({
        public_id: cloudinaryResponse.public_id,
        secure_url: cloudinaryResponse.secure_url,
      });
    }

    const book = await Book.create({
      bookName,
      bookImage: bookImages,
      price,
      type,
      author,
      publication,
      isbn,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create book',
    });
  }
};

export const getAllBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  

  try {
    const totalBooks = await Book.countDocuments();
    const books = await Book.find()
    .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .select('-reviews'); 
      

    res.status(200).json({
      success: true,
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch books',
    });
  }
};

export const getBookDetails = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findById(bookId).populate('reviews.user', ' avatar fullname email');
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch book details',
    });
  }
};

export const deleteBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Optionally, delete images from Cloudinary
    for (const image of book.bookImage) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete book',
    });
  }
};

export const getBookReviews = async (req, res) => {
  const { bookId } = req.params;


  try {
    const book = await Book.findById(bookId).select('reviews averageRating').populate('reviews.user', ' avatar fullname email');
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      reviews: book.reviews,
      averageRating: book.averageRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reviews',
    });
  }
};

export const addReview = async (req, res) => {
  const { bookId } = req.params;
  const {  rating, comment } = req.body;
  console.log(bookId, rating, comment)
  const userId = req.user.id;

  if (!bookId || !rating) {
    return res.status(400).json({ success: false, message: 'Book ID and rating are required' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    book.reviews.push({ rating, comment, user: userId });
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add review',
    });
  }
};

export const searchBooks = async (req, res) => {
  const { query, page = 1, limit = 12 } = req.query;
  console.log(query)
  const skip = (parseInt(page) - 1) * parseInt(limit);

  if (!query) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }

  try {
    // Case-insensitive regex for exact or partial matches
    const regex = new RegExp(query, 'i');
    const words = query.split(/\s+/).filter(word => word.length > 0);
    const substringRegex = new RegExp(words.join('|'), 'i');

    // Combined search criteria for bookName or author
    const searchCriteria = {
      $or: [
        { bookName: regex },
        { author: regex },
        { bookName: substringRegex },
        { author: substringRegex },
      ],
    };

    // Fetch books with pagination, excluding reviews, and sort by createdAt
    const books = await Book.find(searchCriteria)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews');

      console.log(books)

    // Count total matching documents
    const totalBooks = await Book.countDocuments(searchCriteria);

    res.status(200).json({
      success: true,
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search books',
    });
  }
};


export const filterBooksByType = async (req, res) => {
  const { type, page = 1, limit = 12 } = req.query;

  if (!type) {
    return res.status(400).json({ success: false, message: 'Book type is required for filtering' });
  }

  try {
    const totalBooks = await Book.countDocuments({ type });
    const books = await Book.find({ type })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select('-reviews');

    res.status(200).json({
      success: true,
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to filter books',
    });
  }
};