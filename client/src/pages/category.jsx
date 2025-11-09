import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  FaStar,
  FaArrowLeft,
  FaHome,
} from "react-icons/fa";
import Loader from "../components/loader";

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const { token } = useSelector((state) => state.auth);

  const { products, loading: productsLoading } = useSelector(
    (state) => state.product
  );
  const { categories } = useSelector((state) => state.category);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentCategory, setCurrentCategory] = useState(null);

  const wishlistItems = new Set(wishlist.map((item) => item._id));

  useEffect(() => {
    if (categoryName && categories.length > 0) {
      const category = categories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      setCurrentCategory(category);
    }
  }, [categoryName, categories]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (currentCategory) {
        const params = {
          category: currentCategory.name,
          sortBy,
          order: sortOrder,
          limit: 50,
        };

        await Promise.all([
          dispatch(fetchProducts(params)),
          token && dispatch(fetchWishlist({ token })),
        ]);
      }
    };

    fetchCategoryProducts();
  }, [dispatch, currentCategory, sortBy, sortOrder, token]);

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

  const getProductBadge = (product) => {
    if (product.stock === 0)
      return { label: "Out of Stock", color: "bg-red-500" };
    if (product.isNewArrival)
      return { label: "New Arrival", color: "bg-purple-500" };
    if (product.isFeatured) return { label: "Featured", color: "bg-blue-500" };
    if (product.isTrending)
      return { label: "Trending", color: "bg-orange-500" };
    if (product.salePrice && product.salePrice < product.price)
      return { label: "Sale", color: "bg-green-500" };
    return null;
  };

  const getDisplayPrice = (product) => {
    if (product.salePrice && product.salePrice < product.price) {
      return (
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-green-600">
            ₹{product.salePrice}
          </p>
          <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
        </div>
      );
    }
    return <p className="text-lg font-bold text-blue-600">₹{product.price}</p>;
  };

  if (productsLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <FaHome size={14} />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-blue-600 transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium capitalize">
              {currentCategory?.name || categoryName}
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft size={16} />
              <span>Back</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                {currentCategory?.name || categoryName}
              </h1>
              <p className="text-gray-600">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} found
                {currentCategory?.parent && (
                  <span> in {currentCategory.parent.name}</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="createdAt">Newest</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                }
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === "desc" ? "↓" : "↑"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden bg-gray-100">
                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={product.images?.[0]?.url || "/placeholder.jpg"}
                      alt={product.images?.[0]?.alt || product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <button
                    onClick={() => handleWishlist(product)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                      wishlistItems.has(product._id)
                        ? "bg-red-500 text-white"
                        : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                    }`}
                  >
                    <FaHeart size={14} />
                  </button>

                  {getProductBadge(product) && (
                    <div className="absolute top-3 left-3">
                      <span
                        className={`${
                          getProductBadge(product).color
                        } text-white px-2 py-1 rounded text-xs font-medium`}
                      >
                        {getProductBadge(product).label}
                      </span>
                    </div>
                  )}

                  {product.rating > 0 && (
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <FaStar className="text-yellow-400" size={10} />
                      <span>{product.rating}</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {product.brand}
                    </p>
                  </Link>

                  {getDisplayPrice(product)}

                  <p
                    className={`text-xs mt-2 ${
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock < 10
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of stock"
                      : `${product.stock} in stock`}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-colors text-sm ${
                        product.stock === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <FaShoppingCart size={12} />
                      Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-colors text-sm ${
                        product.stock === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <FaCreditCard size={12} />
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                No products available in this category yet.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate("/shop")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse All Products
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
