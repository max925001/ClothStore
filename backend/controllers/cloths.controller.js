import Clothing from '../models/clothing.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import cloudinary from 'cloudinary';

export const createClothing = async (req, res) => {
  const { itemName, price, itemType, description } = req.body;
  const files = req.files; // Array of files from multer

  if (!itemName || !price || !itemType || !files || files.length < 1 || files.length > 5) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided, and 1–5 images are required' });
  }

  try {
    const itemImages = [];
    for (const file of files) {
      const cloudinaryResponse = await uploadOnCloudinary(file);
      if (!cloudinaryResponse) {
        return res.status(500).json({ success: false, message: 'Failed to upload one or more images' });
      }
      itemImages.push({
        public_id: cloudinaryResponse.public_id,
        secure_url: cloudinaryResponse.secure_url,
      });
    }

    const clothing = await Clothing.create({
      itemName,
      itemImages,
      price,
      itemType,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Clothing item created successfully',
      clothing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create clothing item',
    });
  }
};

export const getAllClothing = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    const totalClothing = await Clothing.countDocuments();
    const clothing = await Clothing.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .select('-reviews');

      console.log(clothing)

    res.status(200).json({
      success: true,
      clothing,
      totalClothing,
      totalPages: Math.ceil(totalClothing / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch clothing items',
    });
  }
};

export const getClothingDetails = async (req, res) => {
  const { clothingId } = req.params;

  try {
    const clothing = await Clothing.findById(clothingId).populate('reviews.user', 'avatar fullname email');
    if (!clothing) {
      return res.status(404).json({ success: false, message: 'Clothing item not found' });
    }

    res.status(200).json({
      success: true,
      clothing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch clothing details',
    });
  }
};

export const deleteClothing = async (req, res) => {
  const { clothingId } = req.params;

  try {
    const clothing = await Clothing.findByIdAndDelete(clothingId);
    if (!clothing) {
      return res.status(404).json({ success: false, message: 'Clothing item not found' });
    }

    // Optionally, delete images from Cloudinary
    for (const image of clothing.itemImages) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    res.status(200).json({
      success: true,
      message: 'Clothing item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete clothing item',
    });
  }
};

export const getClothingReviews = async (req, res) => {
  const { clothingId } = req.params;

  try {
    const clothing = await Clothing.findById(clothingId).select('reviews averageRating').populate('reviews.user', 'avatar fullname email');
    if (!clothing) {
      return res.status(404).json({ success: false, message: 'Clothing item not found' });
    }

    res.status(200).json({
      success: true,
      reviews: clothing.reviews,
      averageRating: clothing.averageRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reviews',
    });
  }
};

export const addReview = async (req, res) => {
  const { clothingId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  if (!clothingId || !rating) {
    return res.status(400).json({ success: false, message: 'Clothing ID and rating are required' });
  }

  try {
    const clothing = await Clothing.findById(clothingId);
    if (!clothing) {
      return res.status(404).json({ success: false, message: 'Clothing item not found' });
    }

    clothing.reviews.push({ rating, comment, user: userId });
    await clothing.save();

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      clothing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add review',
    });
  }
};

export const searchClothing = async (req, res) => {
  const { query, page = 1, limit = 12 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  if (!query) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }

  try {
    // Case-insensitive regex for exact or partial matches
    const regex = new RegExp(query, 'i');
    const words = query.split(/\s+/).filter(word => word.length > 0);
    const substringRegex = new RegExp(words.join('|'), 'i');

    // Combined search criteria for itemName
    const searchCriteria = {
      $or: [
        { itemName: regex },
        { itemName: substringRegex },
      ],
    };

    // Fetch clothing items with pagination, excluding reviews, and sort by createdAt
    const clothing = await Clothing.find(searchCriteria)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews');

    // Count total matching documents
    const totalClothing = await Clothing.countDocuments(searchCriteria);

    res.status(200).json({
      success: true,
      clothing,
      totalClothing,
      totalPages: Math.ceil(totalClothing / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search clothing items',
    });
  }
};

export const filterClothingByType = async (req, res) => {
  const { itemType, page = 1, limit = 12 } = req.query;

  if (!itemType) {
    return res.status(400).json({ success: false, message: 'Item type is required for filtering' });
  }

  try {
    const totalClothing = await Clothing.countDocuments({ itemType });
    const clothing = await Clothing.find({ itemType })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select('-reviews');

    res.status(200).json({
      success: true,
      clothing,
      totalClothing,
      totalPages: Math.ceil(totalClothing / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to filter clothing items',
    });
  }
};