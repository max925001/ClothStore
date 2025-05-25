import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { createAccount } from '../redux/slices/user.slice';
import bgbook from '../assets/bgbook.png'

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAccount(formData)).unwrap();
      navigate('/'); // Redirect to login page after successful signup
    } catch (error) {
      // Error handling is managed by toast in userSlice
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: `url(${bgbook})` }}>
      <div className="bg-transparent bg-opacity-50 p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md backdrop-blur-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 text-center mb-6 sm:mb-8">Join Book Haven</h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm sm:text-base font-medium text-orange-500">Full Name</label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="mt-1 w-full p-2 sm:p-3 rounded-md bg-gray-900 bg-opacity-70 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base transition duration-200"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm sm:text-base font-medium text-orange-500">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-2 sm:p-3 rounded-md bg-gray-900 bg-opacity-70 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm sm:text-base font-medium text-orange-500">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full p-2 sm:p-3 rounded-md bg-gray-900 bg-opacity-70 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 cursor-pointer sm:py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md transition duration-300 text-sm sm:text-base shadow-md"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 sm:mt-6 text-center text-sm sm:text-base text-gray-300">
          Already have an account? <a href="/login" className="text-orange-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;