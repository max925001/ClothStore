import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createBook, clearError } from '../redux/slices/book.slice';
import { Toaster, toast } from 'react-hot-toast';
import bgbook from '../assets/bgbook.png';
import SidebarHeader from '../components/SidebarHeader';

const CreateBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.books);

  const [formData, setFormData] = useState({
    bookName: '',
    price: '',
    type: '',
    author: '',
    publication: '',
    isbn: '',
    description: '',
  });
  const [bookImages, setBookImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  // Redirect non-admins or unauthenticated users (uncomment if needed)
  /*
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('You must be an admin to access this page');
      navigate('/login');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, navigate, dispatch]);
  */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = bookImages.length + files.length;

    if (totalImages < 1 || totalImages > 5) {
      setFormErrors({ ...formErrors, bookImage: 'Please select 1–5 images total' });
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setFormErrors({ ...formErrors, bookImage: 'Only .jpg, .jpeg, or .png files are allowed' });
      return;
    }

    const newImages = [...bookImages, ...files];
    setBookImages(newImages);
    setFormErrors({ ...formErrors, bookImage: '' });

    // Generate image previews
    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);

    // Clean up previews on unmount
    return () => newPreviews.forEach((preview) => URL.revokeObjectURL(preview));
  };

  const handleRemoveImage = (index) => {
    const newImages = bookImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setBookImages(newImages);
    setImagePreviews(newPreviews);
    URL.revokeObjectURL(imagePreviews[index]);
    if (newImages.length === 0) {
      setFormErrors({ ...formErrors, bookImage: 'At least one image is required' });
    } else {
      setFormErrors({ ...formErrors, bookImage: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.bookName.trim()) errors.bookName = 'Book name is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
    if (!formData.type) errors.type = 'Book type is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    if (!formData.publication.trim()) errors.publication = 'Publication is required';
    if (bookImages.length === 0) errors.bookImage = 'At least one image is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    bookImages.forEach((file) => data.append('bookImage', file));

    try {
      await dispatch(createBook(data)).unwrap();
      setFormData({
        bookName: '',
        price: '',
        type: '',
        author: '',
        publication: '',
        isbn: '',
        description: '',
      });
      setBookImages([]);
      setImagePreviews([]);
      setTimeout(() => navigate('/find-book', { state: { fromCreateBook: true } }), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SidebarHeader
      backgroundImage={`linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgbook})`}
    >
      <div className="max-w-4xl w-full bg-[#1F1F1F] rounded-xl shadow-2xl p-6 sm:p-8 space-y-8 mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 text-center">Add New Book</h2>
        {error && (
          <p className="text-red-500 text-center bg-red-900/50 p-3 rounded-md">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="bookName" className="block text-sm font-medium text-orange-300">
                Book Name
              </label>
              <input
                id="bookName"
                name="bookName"
                type="text"
                value={formData.bookName}
                onChange={handleChange}
                className={`mt-1 block w-full p-3 rounded-md bg-[#2D2D2D] text-white border ${formErrors.bookName ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200`}
                placeholder="Enter book name"
              />
              {formErrors.bookName && (
                <p className="mt-1 text-red-500 text-sm">{formErrors.bookName}</p>
              )}
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-orange-300">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className={`mt-1 block w-full p-3 rounded-md bg-[#2D2D2D] text-white border ${formErrors.price ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200`}
                placeholder="Enter price"
              />
              {formErrors.price && (
                <p className="mt-1 text-red-500 text-sm">{formErrors.price}</p>
              )}
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-orange-300">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`mt-1 block w-full p-3 rounded-md bg-[#2D2D2D] text-white border ${formErrors.type ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200`}
              >
                <option value="">Select book type</option>
                <option value="comedy">Comedy</option>
                <option value="study">Study</option>
                <option value="romantic">Romantic</option>
                <option value="horror">Horror</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="mystery">Mystery</option>
                <option value="fantasy">Fantasy</option>
                <option value="biography">Biography</option>
              </select>
              {formErrors.type && (
                <p className="mt-1 text-red-500 text-sm">{formErrors.type}</p>
              )}
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-orange-300">
                Author
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleChange}
                className={`mt-1 block w-full p-3 rounded-md bg-[#2D2D2D] text-white border ${formErrors.author ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200`}
                placeholder="Enter author name"
              />
              {formErrors.author && (
                <p className="mt-1 text-red-500 text-sm">{formErrors.author}</p>
              )}
            </div>
            <div>
              <label htmlFor="publication" className="block text-sm font-medium text-orange-300">
                Publication
              </label>
              <input
                id="publication"
                name="publication"
                type="text"
                value={formData.publication}
                onChange={handleChange}
                className={`mt-1 block w-full p-3 rounded-md bg-[#2D2D2D] text-white border ${formErrors.publication ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200`}
                placeholder="Enter publication"
              />
              {formErrors.publication && (
                <p className="mt-1 text-red-500 text-sm">{formErrors.publication}</p>
              )}
            </div>
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-orange-300">
                ISBN (Optional)
              </label>
              <input
                id="isbn"
                name="isbn"
                type="text"
                value={formData.isbn}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-md bg-[#2D2D2D] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
                placeholder="Enter ISBN"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-orange-300">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-md bg-[#2D2D2D] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
                rows="4"
                placeholder="Enter book description"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="bookImage" className="block text-sm font-medium text-orange-300">
                Book Images (1–5, .jpg/.jpeg/.png)
              </label>
              <input
                id="bookImage"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
                className="mt-1 block w-full p-3 rounded-md bg-[#2D2D2D] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
                disabled={bookImages.length >= 5}
              />
              {formErrors.bookImage && (
                <p className="mt-1 text-red-500 text-sm">{formErrors.bookImage}</p>
              )}
              {bookImages.length >= 5 && (
                <p className="mt-1 text-orange-300 text-sm">Maximum 5 images reached. Remove an image to add another.</p>
              )}
            </div>
            {imagePreviews.length > 0 && (
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-orange-300 mb-2">Image Previews</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition duration-200"
                        title="Remove image"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 cursor-pointer hover:bg-orange-700 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </SidebarHeader>
  );
};

export default CreateBook;