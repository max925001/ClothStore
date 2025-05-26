import express from 'express';
import { createBook, getAllBooks, getBookDetails, deleteBook, getBookReviews, addReview, searchBooks, filterBooksByType } from '../controllers/book.controller.js';
import { isLoggedIn, authorizedRoles } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const bookrouter = express.Router();

bookrouter.post('/books', isLoggedIn, authorizedRoles('ADMIN'), upload.array('bookImage', 5), createBook);
bookrouter.get('/books',isLoggedIn, getAllBooks);
bookrouter.get('/books/filter', isLoggedIn, filterBooksByType);
bookrouter.get('/books/search', isLoggedIn ,searchBooks);
bookrouter.get('/books/:bookId', isLoggedIn,getBookDetails);
bookrouter.delete('/books/:bookId', isLoggedIn, authorizedRoles('ADMIN'), deleteBook);
bookrouter.get('/books/:bookId/reviews', isLoggedIn ,getBookReviews);
bookrouter.post('/books/:bookId/reviews', isLoggedIn, addReview);



export default bookrouter;