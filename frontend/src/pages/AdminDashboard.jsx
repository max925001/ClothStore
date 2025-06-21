import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarHeader from '../components/SidebarHeader';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleCreateBook = () => {
    navigate('/createcloth');
  };

  return (
    <SidebarHeader>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-[50vh] flex flex-col items-center justify-center">
        {/* Welcome Section */}
        <div className="bg-[#1F1F1F] rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-4 sm:mb-6">
            Welcome, Admin!
          </h1>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
            Manage your clothstore with ease. Start by adding a new cloth to the collection.
          </p>

          {/* Create Book Button */}
          <button
            onClick={handleCreateBook}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-orange-500 cursor-pointer text-white rounded-md hover:bg-orange-600 transition duration-200 text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl focus:outline-none"
          >
            Create New Cloth
          </button>
        </div>
      </div>
    </SidebarHeader>
  );
}

export default AdminDashboard;