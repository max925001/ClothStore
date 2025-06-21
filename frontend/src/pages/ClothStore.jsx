import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { getAllClothing, searchClothing, filterClothingByType, setCurrentPage, clearSearchResults, clearFilterResults } from '../redux/slices/clothing.slice';
import SidebarHeader from '../components/SidebarHeader';

const ClothStore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pages, searchResults, filterResults, loading, error, totalClothing, totalPages, currentPage, hasFetchedInitial } = useSelector((state) => state.clothing);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const limit = 12;

  // Initial fetch on page load (page 1), only if not already fetched
  useEffect(() => {
    if (!hasFetchedInitial) {
      dispatch(getAllClothing({ page: 1, limit }));
    }
  }, [dispatch, limit, hasFetchedInitial]);

  // Debounce search query
  useEffect(() => {
    if (searchQuery) {
      setIsTyping(true);
    }
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsTyping(false);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Handle search
  useEffect(() => {
    if (debouncedQuery) {
      dispatch(searchClothing({ query: debouncedQuery, page: 1, limit }));
    } else {
      dispatch(clearSearchResults());
      dispatch(setCurrentPage(1));
    }
  }, [debouncedQuery, dispatch, limit]);

  // Handle filter
  useEffect(() => {
    if (filterType) {
      dispatch(filterClothingByType({ itemType: filterType, page: 1, limit }));
    } else {
      dispatch(clearFilterResults());
      dispatch(setCurrentPage(1));
    }
  }, [filterType, dispatch, limit]);

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      dispatch(setCurrentPage(prevPage));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      if (debouncedQuery) {
        dispatch(searchClothing({ query: debouncedQuery, page: nextPage, limit }));
      } else if (filterType) {
        dispatch(filterClothingByType({ itemType: filterType, page: nextPage, limit }));
      } else {
        dispatch(getAllClothing({ page: nextPage, limit }));
      }
      dispatch(setCurrentPage(nextPage));
    }
  };

  // Handle card click
  const handleCardClick = (clothingId) => {
    navigate(`/cloth-detail/${clothingId}`);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setFilterType(''); // Reset filter when searching
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const type = e.target.value;
    setFilterType(type);
    setSearchQuery(''); // Reset search when filtering
  };

  // Determine which clothing items to display
  const displayedClothing = debouncedQuery
    ? searchResults.clothing
    : filterType
    ? filterResults.clothing
    : pages[currentPage] || [];

  const displayedTotalPages = debouncedQuery
    ? searchResults.totalPages
    : filterType
    ? filterResults.totalPages
    : totalPages;

  // Clothing types for filter dropdown
  const clothingTypes = [
    '',
    'shirt',
    'pants',
    'shoes',
    'sports gear',
    'jacket',
    'dress',
    'skirt',
    'sweater',
    'accessories',
  ];

  return (
    <SidebarHeader>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search by clothing item name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full sm:w-1/2 px-4 py-2 bg-[#2D2D2D] text-gray-300 border border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="w-full sm:w-1/4 px-4 py-2 bg-[#2D2D2D] text-gray-300 border border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {clothingTypes.map((type) => (
              <option key={type || 'all'} value={type}>
                {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'All Types'}
              </option>
            ))}
          </select>
        </div>

        {/* Clothing Grid */}
        {(loading || isTyping) ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-orange-500 text-xl">Loading...</p>
          </div>
        ) : displayedClothing.length === 0 && !loading && !isTyping ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-orange-500 text-xl">No clothing items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedClothing.map((clothing) => (
              console.log(clothing._id),
              <div
                key={clothing._id}
                onClick={() => handleCardClick(clothing._id)}
                className="bg-[#2D2D2D] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-200"
              >
                <img
                  src={clothing.itemImages[0]?.secure_url || 'https://via.placeholder.com/300'}
                  alt={clothing.itemName}
                  className="w-full h-64 object-cover"
                  style={{ aspectRatio: '3/4' }}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-orange-500 truncate">{clothing.itemName}</h3>
                  <p className="text-sm text-gray-400 truncate">{clothing.itemType}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !isTyping && displayedClothing.length > 0 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-white ${
                currentPage === 1
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700'
              } transition duration-200`}
            >
              Prev
            </button>
            <span className="text-gray-300 py-2">
              Page {currentPage} of {displayedTotalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === displayedTotalPages}
              className={`px-4 py-2 rounded-md text-white ${
                currentPage === displayedTotalPages
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700'
              } transition duration-200`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </SidebarHeader>
  );
};

export default ClothStore;