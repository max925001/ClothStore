import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { getBookDetails, addReview, resetCurrentBook } from '../redux/slices/book.slice';
import SidebarHeader from '../components/SidebarHeader';

// Function to calculate time difference
const getTimeAgo = (date) => {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffInSeconds = Math.floor((now - reviewDate) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} sec${diffInSeconds === 1 ? '' : 's'} ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes === 1 ? '' : 's'} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};

// Star Rating Component
const StarRating = ({ rating, onRatingChange, interactive = false }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex">
      {stars.map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 sm:w-6 sm:h-6 ${star <= rating ? 'text-orange-500' : 'text-gray-400'} ${
            interactive ? 'cursor-pointer hover:text-orange-400 transition-colors' : ''
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
          onClick={() => interactive && onRatingChange(star)}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBook, loading, error } = useSelector((state) => state.books);

  // State for carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State for review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');

  // State for dynamic time updates
  const [timeAgo, setTimeAgo] = useState({});

  // Fetch book details on mount
  useEffect(() => {
    // Validate bookId format (MongoDB ObjectId)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(bookId);
    if (!bookId || !isValidObjectId) {
      toast.error('Invalid book ID');
      navigate('/find-book');
      return;
    }

    dispatch(getBookDetails(bookId));

    // Cleanup on unmount
    return () => {
      dispatch(resetCurrentBook());
    };
  }, [dispatch, bookId, navigate]);

  // Update time ago every 10 seconds for better performance
  useEffect(() => {
    if (!currentBook?.reviews) return;

    const updateTimeAgo = () => {
      const newTimeAgo = {};
      currentBook.reviews.forEach((review) => {
        newTimeAgo[review._id] = getTimeAgo(review.createdAt);
      });
      setTimeAgo(newTimeAgo);
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [currentBook?.reviews]);

  // Carousel navigation
  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (currentBook?.bookImage?.length || 1) - 1 : prev - 1
    );
  }, [currentBook?.bookImage?.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === (currentBook?.bookImage?.length || 1) - 1 ? 0 : prev + 1
    );
  }, [currentBook?.bookImage?.length]);

  // Handle review submission
  const handleAddReview = async (e) => {
    console.log("value",e)
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setFormError('Please select a rating between 1 and 5 stars');
      return;
    }
    if (!comment.trim()) {
      setFormError('Please enter a comment');
      return;
    }
    console.log(bookId, rating, comment)

    try {
      await dispatch(addReview({ bookId, rating, comment })).unwrap();
      setRating(0);
      setComment('');
      setFormError('');
    } catch (err) {
      setFormError(err.message || 'Failed to add review');
    }
  };

  return (
    <SidebarHeader>
      <Toaster position="top-center" reverseOrder={false} />
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-orange-500 text-lg sm:text-xl animate-pulse">Loading...</p>
        </div>
      ) : error || !currentBook ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-red-500 text-lg sm:text-xl">{error || 'Book not found'}</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Book Details Section */}
          <div className="bg-[#1F1F1F] rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 break-words">
              {currentBook.bookName}
            </h1>

            {/* Image Carousel */}
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              <img
                src={
                  currentBook.bookImage[currentImageIndex]?.secure_url ||
                  'https://via.placeholder.com/300'
                }
                alt={`Book Image ${currentImageIndex + 1}`}
                className="w-full h-48 sm:h-64 md:h-72 object-cover rounded-md"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
              />
              {currentBook.bookImage.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition duration-200 focus:outline-none"
                    aria-label="Previous image"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition duration-200 focus:outline-none"
                    aria-label="Next image"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
                    {currentBook.bookImage.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                          index === currentImageIndex ? 'bg-orange-500' : 'bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Book Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <p className="text-gray-300 text-sm sm:text-base">
                  <span className="font-semibold text-orange-500">Author:</span>{' '}
                  {currentBook.author}
                </p>
                <p className="text-gray-300 text-sm sm:text-base">
                  <span className="font-semibold text-orange-500">Price:</span> ${currentBook.price}
                </p>
                <p className="text-gray-300 text-sm sm:text-base">
                  <span className="font-semibold text-orange-500">Type:</span> {currentBook.type}
                </p>
                <p className="text-gray-300 text-sm sm:text-base">
                  <span className="font-semibold text-orange-500">Publication:</span>{' '}
                  {currentBook.publication}
                </p>
                {currentBook.isbn && (
                  <p className="text-gray-300 text-sm sm:text-base">
                    <span className="font-semibold text-orange-500">ISBN:</span> {currentBook.isbn}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-gray-300 text-sm sm:text-base">
                  <span className="font-semibold text-orange-500">Average Rating:</span>
                </p>
                <StarRating rating={Math.round(currentBook.averageRating || 0)} />
                {currentBook.description && (
                  <p className="text-gray-300 text-sm sm:text-base mt-2">
                    <span className="font-semibold text-orange-500">Description:</span>{' '}
                    {currentBook.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Add Review Section */}
          <div className="bg-[#1F1F1F] rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 mt-4 sm:mt-6">
            <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-4">Add Your Review</h2>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-300">Rating</label>
                <StarRating rating={rating} onRatingChange={setRating} interactive={true} />
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-orange-300">
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1 block w-full p-3 rounded-md bg-[#2D2D2D] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 text-sm sm:text-base"
                  rows="4"
                  placeholder="Write your review here..."
                />
              </div>
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-sm sm:text-base"
                
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Reviews Section */}
          <div className="bg-[#1F1F1F] rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 mt-4 sm:mt-6">
            <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-4">Reviews</h2>
            {currentBook.reviews?.length === 0 ? (
              <p className="text-gray-300 text-sm sm:text-base">
                No reviews yet. Be the first to review this book!
              </p>
            ) : (
              <div className="space-y-4">
                {currentBook.reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-600 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="text-orange-500 font-semibold text-sm sm:text-base">
                          {review.user?.fullName || 'Anonymous'}
                        </p>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-0">
                        {timeAgo[review._id] || getTimeAgo(review.createdAt)}
                      </p>
                    </div>
                    <p className="text-gray-300 mt-2 text-sm sm:text-base">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </SidebarHeader>
  );
}

export default BookDetail;