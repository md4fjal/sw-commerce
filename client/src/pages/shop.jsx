import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import { addToCart } from "../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../redux/slices/wishlistSlice";
import {
  FaHeart,
  FaShoppingCart,
  FaCreditCard,
  FaSearch,
} from "react-icons/fa";
import Loader from "../components/loader";

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  const { products, loading: productsLoading } = useSelector(
    (state) => state.product
  );
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.category
  );
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    Promise.all([
      dispatch(fetchProducts({ search: searchParam || "" })),
      dispatch(fetchCategories({})),
      token && dispatch(fetchWishlist({ token })),
    ]);
  }, [dispatch, token, location.search]);

  // Convert wishlist array to Set for easy lookup
  const wishlistItems = new Set(wishlist.map((item) => item._id));

  const filteredProducts = selectedCategory
    ? products.filter(
        (p) =>
          p.category?._id === selectedCategory ||
          p.category?.name === selectedCategory
      )
    : products;

  const handleAddToCart = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ token, productId: product._id, quantity: 1 }));
  };

  const handleBuyNow = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ token, productId: product._id, quantity: 1 }));
    navigate("/cart");
  };

  const handleWishlist = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (wishlistItems.has(product._id)) {
      dispatch(removeFromWishlist({ token, productId: product._id }));
    } else {
      dispatch(addToWishlist({ token, productId: product._id }));
    }
  };

  const isInCart = (productId) => {
    return cart.some((item) => item.product?._id === productId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/shop");
    }
  };

  if (productsLoading || categoriesLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-500"
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Our Products
            </h1>
            <p className="text-gray-600">Discover amazing products</p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                !selectedCategory
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  selectedCategory === cat._id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Count */}
        <div className="mb-6 text-center">
          <span className="bg-white px-4 py-2 rounded-lg text-gray-700 text-sm font-medium border border-gray-300">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Product Image Container */}
              <div className="relative overflow-hidden bg-gray-100">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.images}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Wishlist Button */}
                <button
                  onClick={() => handleWishlist(product)}
                  className={`absolute top-3 right-3 p-2 rounded-md transition-all duration-200 ${
                    wishlistItems.has(product._id)
                      ? "bg-red-500 text-white"
                      : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                  }`}
                >
                  <FaHeart size={14} />
                </button>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {product.category?.name}
                  </span>
                </div>

                {/* In Cart Badge */}
                {isInCart(product._id) && (
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      In Cart
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h2>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xl font-bold text-blue-600">
                    ${product.price}
                  </p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    <FaShoppingCart />{" "}
                    {isInCart(product._id) ? "Added" : "Cart"}
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    <FaCreditCard /> Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg p-8 max-w-md mx-auto border border-gray-200">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Try selecting a different category or search term
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                  navigate("/shop");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Show All Products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
