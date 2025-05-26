import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaUser, FaTachometerAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { logout } from '../redux/slices/user.slice';

const SidebarHeader = ({ children, backgroundImage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, data } = useSelector((state) => state.auth);
  const imageUrl = data?.avatar?.secure_url || null;

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('data');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-[#1F1F1F] text-white">
      {/* Header */}
      <header className="p-3 sm:p-4 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-orange-500 hover:text-orange-600 focus:outline-none cursor-pointer"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-orange-500">BookStore</h1>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#2D2D2D] w-56 sm:w-64 md:w-72 z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out xs:w-3/4`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-orange-500">Menu</h2>
            <button
              onClick={toggleSidebar}
              className="text-orange-500 hover:text-orange-600 focus:outline-none"
              aria-label="Close sidebar"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-md hover:bg-[#3A3A3A] text-orange-300 hover:text-orange-500 transition duration-200"
                >
                  <FaHome size={18} />
                  <span className="text-sm sm:text-base">Home</span>
                </Link>
              </li>
              {isLoggedIn && data && (
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-[#3A3A3A] text-orange-300 hover:text-orange-500 transition duration-200"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="User avatar"
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                        onError={(e) => (e.target.src = '')}
                      />
                    ) : (
                      <FaUserCircle size={18} />
                    )}
                    <span className="text-sm sm:text-base">Profile</span>
                  </Link>
                </li>
              )}
              {isLoggedIn && data && data.role === 'ADMIN' && (
                <li>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-[#3A3A3A] text-orange-300 hover:text-orange-500 transition duration-200"
                  >
                    <FaTachometerAlt size={18} />
                    <span className="text-sm sm:text-base">Admin Dashboard</span>
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer space-x-3 p-3 w-full text-left rounded-md hover:bg-[#3A3A3A] text-orange-300 hover:text-orange-500 transition duration-200"
                  >
                    <FaSignOutAlt size={18} />
                    <span className="text-sm sm:text-base">Logout</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main
        className="flex-1 flex items-center justify-center min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-cover bg-center bg-no-repeat pt-14 sm:pt-16"
        style={{ backgroundImage: backgroundImage || 'none' }}
      >
        {children}
      </main>
    </div>
  );
};

export default SidebarHeader;