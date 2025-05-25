import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCamera } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { getUserData, updateUser } from '../redux/slices/user.slice';
import SidebarHeader from '../components/SidebarHeader';
import bgbook from '../assets/bgbook.png';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { isLoggedIn, data: user, status, error } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch user data if not available
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!user || Object.keys(user).length === 0) {
      dispatch(getUserData());
    }
  }, [isLoggedIn, user, dispatch, navigate]);

  // Handle navigation and errors for user data fetching
  useEffect(() => {
    if (status === 'failed' && error) {
      toast.error(error);
    //   navigate('/login');
    }
  }, [status, error, navigate]);

  // Clean up preview image URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Handle image selection and preview
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPEG, JPG, or PNG image');
      return;
    }

    // Set preview and selected file
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Handle image upload when user confirms
  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error('No image selected to upload');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await dispatch(updateUser(formData)).unwrap();
      if (response.user) {
        // Refresh user data after successful upload
        await dispatch(getUserData()).unwrap();
        // Clear preview and selected file
        setPreviewImage(null);
        setSelectedFile(null);
        
      } else {
       
      }
    } catch (err) {
      // Error handling is managed by toast in userSlice
    } finally {
      setLoading(false);
    }
  };

  // Trigger file input click
  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  // Cancel preview and reset
  const handleCancel = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };



  const imageUrl = user.avatar?.secure_url && user.avatar.secure_url !== '' ? user.avatar.secure_url : null;

  return (
    <SidebarHeader>
      <div className="w-full max-w-md sm:max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#2D2D2D] rounded-lg shadow-md p-6 sm:p-8 space-y-6">
          {/* Avatar Section */}
          <div className="relative flex flex-col items-center">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-orange-500"
                />
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt="User avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-orange-500"
                  onError={(e) => (e.target.src = '')}
                />
              ) : (
                <FaUserCircle className="w-full h-full text-orange-500" />
              )}
              <button
                onClick={handleCameraClick}
                className="absolute bottom-0 right-0 bg-orange-600 text-white rounded-full p-2 hover:bg-orange-700 transition duration-200 cursor-pointer"
                disabled={loading}
              >
                <FaCamera size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept=".jpg,.jpeg,.png"
                className="hidden"
              />
            </div>
            {previewImage && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={handleImageUpload}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition duration-200 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : 'Change Profile Image'}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="space-y-4 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-orange-500">
              {user.fullname}
            </h2>
            <p className="text-sm sm:text-base text-gray-300">
              <span className="font-medium text-orange-300">Email:</span> {user.email}
            </p>
            <p className="text-sm sm:text-base text-gray-300">
              <span className="font-medium text-orange-300">Role:</span> {user.role}
            </p>
            <p className="text-sm sm:text-base text-gray-300">
              <span className="font-medium text-orange-300">Joined:</span>{' '}
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </SidebarHeader>
  );
};

export default Profile;