import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: [true, 'Book name is required'],
      trim: true,
      lowercase: true,
    },
    bookImage: {
      type: [
        {
          public_id: { type: String, required: true },
          secure_url: { type: String, required: true },
        },
      ],
      validate: {
        validator: function (images) {
          return images.length >= 1 && images.length <= 5;
        },
        message: 'Book must have at least 1 and at most 5 images',
      },
      required: [true, 'At least one book image is required'],
    },
    reviews: [
      {
        rating: {
          type: Number,
          required: [true, 'Rating is required'],
          min: [1, 'Rating must be at least 1'],
          max: [5, 'Rating cannot exceed 5'],
        },
        comment: {
          type: String,
          trim: true,
          default: '',
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: [true, 'User is required for review'],
        },
      },
    ],
    averageRating: {
      type: Number,
      min: [0, 'Average rating cannot be negative'],
      max: [5, 'Average rating cannot exceed 5'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    type: {
      type: String,
      enum: {
        values: ['comedy', 'study', 'romantic', 'horror', 'fiction', 'non-fiction', 'mystery', 'fantasy', 'biography'],
        message: '{VALUE} is not a valid book type',
      },
      required: [true, 'Book type is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    publication: {
      type: String,
      required: [true, 'Publication is required'],
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate averageRating
bookSchema.pre('save', function (next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

export default mongoose.model('Book', bookSchema);