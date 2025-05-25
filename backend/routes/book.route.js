import express from 'express';
import { createBook, getAllBooks, getBookDetails, deleteBook, getBookReviews, addReview, searchBooks, filterBooksByType } from '../controllers/book.controller.js';
import { isLoggedIn, authorizedRoles } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const bookrouter = express.Router();

bookrouter.post('/books', isLoggedIn, authorizedRoles('ADMIN'), upload.array('bookImage', 5), createBook);
bookrouter.get('/books', getAllBooks);
bookrouter.get('/books/filter', filterBooksByType);
bookrouter.get('/books/search', searchBooks);
bookrouter.get('/books/:bookId', getBookDetails);
bookrouter.delete('/books/:bookId', isLoggedIn, authorizedRoles('admin'), deleteBook);
bookrouter.get('/books/:bookId/reviews', getBookReviews);
bookrouter.post('/books/:bookId/reviews', isLoggedIn, addReview);



export default bookrouter;