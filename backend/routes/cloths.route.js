import express from 'express';
import { createClothing, getAllClothing, getClothingDetails, deleteClothing, getClothingReviews, addReview, searchClothing, filterClothingByType } from '../controllers/cloths.controller.js';
import { isLoggedIn, authorizedRoles } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const clothrouter = express.Router();

clothrouter.post('/cloths', isLoggedIn, authorizedRoles('ADMIN'), upload.array('clothsImage', 5), createClothing);
clothrouter.get('/cloths',isLoggedIn, getAllClothing);
clothrouter.get('/cloths/filter', isLoggedIn, filterClothingByType);
clothrouter.get('/cloths/search', isLoggedIn ,searchClothing);
clothrouter.get('/cloths/:clothingId', isLoggedIn,getClothingDetails);
clothrouter.delete('/cloths/:clothId', isLoggedIn, authorizedRoles('ADMIN'), deleteClothing);
clothrouter.get('/cloths/:clothId/reviews', isLoggedIn , getClothingReviews);
clothrouter.post('/cloths/:clothsId/reviews', isLoggedIn, addReview);



export default clothrouter;