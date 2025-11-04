import {
  FaArrowRight,
  FaStar,
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaHeart,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import { addToCart } from "../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/slices/wishlistSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { products, loading: productLoading } = useSelector(
    (state) => state.product
  );
  const { categories, loading: categoryLoading } = useSelector(
    (state) => state.category
  );
  const { wishlist } = useSelector((state) => state.wishlist);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
    dispatch(fetchCategories({}));
  }, [dispatch]);

  const features = [
    {
      icon: FaStar,
      title: "Premium Quality",
      description: "Handpicked items with the highest quality standards",
    },
    {
      icon: FaShippingFast,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50",
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payment",
      description: "Your payments are safe and secure",
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "We're here to help you anytime",
    },
  ];

  const handleAddToCart = (productId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ token, productId, quantity: 1 }));
  };

  const handleWishlist = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    const isInWishlist = wishlist.some((item) => item._id === product._id);
    if (isInWishlist) {
      dispatch(removeFromWishlist({ token, productId: product._id }));
    } else {
      dispatch(addToWishlist({ token, productId: product._id }));
    }
  };

  const handleBuyNow = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ token, productId: product._id, quantity: 1 }));
    navigate("/cart");
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pl-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-500"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
              FashionStore
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Discover the latest trends in fashion with our exclusive collection
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <span>Shop Now</span>
            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-300 text-center"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-xl text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Shop by Category
          </h2>
          {categoryLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories?.slice(0, 4).map((category) => (
                <div
                  key={category._id}
                  onClick={() => navigate(`/categories/${category._id}`)}
                  className="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer p-6 text-center"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-20 h-20 object-cover mx-auto rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate("/categories")}
            className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            View All Categories
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Products
          </h2>
          {productLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden group relative"
                >
                  <Link to={`/product/${product._id}`}>
                    {" "}
                    <img
                      src={product.images}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(product);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                      isInWishlist(product._id)
                        ? "bg-red-500 text-white"
                        : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                    }`}
                  >
                    <FaHeart size={14} />
                  </button>

                  <div className="p-4 text-left">
                    <h3 className="text-base font-semibold text-gray-800 truncate mb-1">
                      {product.name}
                    </h3>
                    <p className="text-blue-600 font-bold text-lg">
                      ${product.price}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product._id);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <FaShoppingCart size={12} />
                        Cart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(product);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate("/shop")}
            className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            View All Products
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Upgrade Your Style?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their fashion
            needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/shop")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg"
            >
              Start Shopping
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200"
            >
              View Cart
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
