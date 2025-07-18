import { useNavigate, Link } from 'react-router-dom';
import Slider from 'react-slick';
import { TypeAnimation } from 'react-type-animation';
import { FaStar, FaTshirt } from 'react-icons/fa';
import SidebarHeader from '../components/SidebarHeader';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { clothingItems,recommendedClothing } from '../data/cloths';
import bghome from '../assets/bghome.jpg';

// Dummy clothing data




// Dummy testimonials
const testimonials = [
  { name: 'John Doe', text: 'Amazing selection of clothes! Found my favorite outfit in minutes.' },
  { name: 'Jane Smith', text: 'The reviews helped me pick the perfect shirt. Highly recommend!' },
  { name: 'Alex Brown', text: 'Fast and easy to navigate. Love the dark theme!' },
];

const Home = () => {
  const navigate = useNavigate();

  // Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <SidebarHeader
      backgroundImage={`linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bghome})`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-500">
            <TypeAnimation
              sequence={[
                'Discover Your Next Outfit',
                2000,
                'Explore Stylish Looks',
                2000,
                'Find Your Perfect Clothing',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </h1>
          <p className="text-lg sm:text-xl text-orange-300 max-w-2xl mx-auto">
            Dive into a world of fashion, style, and comfort with ClothStore.
          </p>
          <button
            onClick={() => navigate('/find-clothing')}
            className="inline-block px-8 py-3 bg-orange-600 text-white cursor-pointer font-semibold rounded-md hover:bg-orange-700 transition duration-200"
          >
            Find Your Clothing
          </button>
        </section>

        {/* Clothing Carousel */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-orange-500 text-center">
            Featured Clothing
          </h2>
          <Slider {...sliderSettings}>
            {clothingItems.map((clothing) => (
              <div key={clothing.id} className="px-2">
                <div className="bg-[#2D2D2D] rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300">
                  <img
                    src={clothing.image}
                    alt={clothing.name}
                    className="w-full h-64 sm:h-72 object-cover"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
                    style={{ aspectRatio: '3/4' }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-orange-300 truncate">
                      {clothing.name}
                    </h3>
                    <p className="text-sm text-gray-400">{clothing.type}</p>
                    <p className="text-base sm:text-lg font-bold text-orange-500">
                      ${clothing.price.toFixed(2)}
                    </p>
                    <Link
                      to={`/cloths/${clothing.id}`}
                      className="mt-2 inline-block text-orange-400 hover:text-orange-500 text-sm"
                    >
                      See Reviews
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* Clothing Store Button */}
        <section className="text-center">
          <button
            onClick={() => navigate('/find-clothing')}
            className="inline-block px-8 py-3 bg-[#2D2D2D] cursor-pointer text-orange-500 font-semibold rounded-md border border-orange-500 hover:bg-orange-500 hover:text-white transition duration-200"
          >
            Visit Our Clothing Store
          </button>
        </section>

        {/* Recommended Clothing */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-orange-500 text-center">
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommendedClothing.map((clothing) => (
              <div
                key={clothing.id}
                className="bg-[#2D2D2D] rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300"
              >
                <img
                  src={clothing.image}
                  alt={clothing.name}
                  className="w-full h-48 sm:h-56 object-cover"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
                  style={{ aspectRatio: '3/4' }}
                />
                <div className="p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-orange-300 truncate">
                    {clothing.name}
                  </h3>
                  <p className="text-sm text-gray-400">{clothing.type}</p>
                  <p className="text-base font-bold text-orange-500">
                    ${clothing.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-orange-500 text-center">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#2D2D2D] rounded-lg p-4 sm:p-6 shadow-md"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <FaStar className="text-orange-500" />
                  <FaStar className="text-orange-500" />
                  <FaStar className="text-orange-500" />
                  <FaStar className="text-orange-500" />
                  <FaStar className="text-orange-500" />
                </div>
                <p className="text-sm sm:text-base text-gray-300">
                  "{testimonial.text}"
                </p>
                <p className="mt-2 text-orange-400 font-semibold">
                  - {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400 py-6 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
            <Link to="/" className="hover:text-orange-500 transition duration-200">
              Home
            </Link>
            <Link to="/find-clothing" className="hover:text-orange-500 transition duration-200">
              Find Clothing
            </Link>
            <Link to="/profile" className="hover:text-orange-500 transition duration-200">
              Profile
            </Link>
          </div>
          <p className="text-sm">
            © 2025 ClothStore. All rights reserved.
          </p>
        </footer>
      </div>
    </SidebarHeader>
  );
};

export default Home;