import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchWishlist,
  removeFromWishlist,
  toggleWishlistItem,
  removeItemInstantly,
} from "../redux/slices/wishlistSlice";
import { addToCart } from "../redux/slices/cartSlice";
import {
  FaHeart,
  FaTrash,
  FaShoppingCart,
  FaArrowLeft,
  FaStar,
  FaCreditCard,
  FaTag,
} from "react-icons/fa";
import Loader from "../components/loader";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist({ token }));
    }
  }, [dispatch, token]);

  const handleRemoveFromWishlist = async (product) => {
    if (window.confirm("Remove this item from your wishlist?")) {
      try {
        dispatch(removeItemInstantly(product._id));

        await dispatch(
          removeFromWishlist({ token, productId: product._id })
        ).unwrap();
      } catch (error) {
        alert(error || "Failed to remove from wishlist");
        dispatch(fetchWishlist({ token }));
      }
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await dispatch(
        addToCart({ token, productId: product._id, quantity: 1 })
      ).unwrap();
      alert("Product added to cart!");
    } catch (error) {
      alert(error || "Failed to add product to cart");
    }
  };

  const handleBuyNow = async (product) => {
    try {
      await dispatch(
        addToCart({ token, productId: product._id, quantity: 1 })
      ).unwrap();
      navigate("/cart");
    } catch (error) {
      alert(error || "Failed to add product to cart");
    }
  };

  const handleMoveAllToCart = async () => {
    const inStockProducts = wishlist.filter((product) => product.stock > 0);

    if (inStockProducts.length === 0) {
      alert("No items in your wishlist are currently in stock.");
      return;
    }

    try {
      const addPromises = inStockProducts.map((product) =>
        dispatch(
          addToCart({ token, productId: product._id, quantity: 1 })
        ).unwrap()
      );

      await Promise.all(addPromises);
      alert(`${inStockProducts.length} items moved to cart!`);
    } catch (error) {
      alert("Some items failed to add to cart. Please try again.");
    }
  };

  const isInCart = (productId) => {
    return cart.some((item) => item.product?._id === productId);
  };

  const getDisplayPrice = (product) => {
    if (!product) return null;

    const price = product.price || 0;
    const salePrice = product.salePrice;

    if (salePrice && salePrice < price) {
      return (
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-green-600">
            ₹{salePrice.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 line-through">
            ₹{price.toLocaleString()}
          </p>
          <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded text-xs">
            Save ₹{(price - salePrice).toLocaleString()}
          </span>
        </div>
      );
    }
    return (
      <p className="text-lg font-bold text-blue-600">
        ₹{price.toLocaleString()}
      </p>
    );
  };

  const getProductBadge = (product) => {
    if (!product) return null;

    if (product.stock === 0)
      return { label: "Out of Stock", color: "bg-red-500" };
    if (product.isNewArrival) return { label: "New", color: "bg-purple-500" };
    if (product.isFeatured) return { label: "Featured", color: "bg-blue-500" };
    if (product.isTrending)
      return { label: "Trending", color: "bg-orange-500" };
    if (product.salePrice && product.salePrice < product.price)
      return { label: "Sale", color: "bg-green-500" };
    return null;
  };

  if (loading && wishlist.length === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <div className="w-24"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {!token ? (
          // Not logged in state
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Please Login
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You need to be logged in to view your wishlist and save your
              favorite items.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        ) : wishlist.length === 0 ? (
          // Empty Wishlist State
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="text-4xl mb-4">💖</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love to your wishlist. Review them anytime and
              easily move them to your cart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/shop")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Shopping
              </button>
              <button
                onClick={() => navigate("/categories")}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Browse Categories
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Actions Bar */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <FaHeart className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {wishlist.length}{" "}
                      {wishlist.length === 1 ? "item" : "items"} in wishlist
                    </h3>
                    <p className="text-sm text-gray-600">
                      Save items you love for later
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleMoveAllToCart}
                    disabled={
                      loading ||
                      wishlist.every((product) => product.stock === 0)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaShoppingCart />
                    {loading ? "Moving..." : "Move All to Cart"}
                  </button>
                  <button
                    onClick={() => navigate("/shop")}
                    disabled={loading}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => {
                if (!product) return null;

                const badge = getProductBadge(product);
                const outOfStock = product.stock === 0;
                const itemInCart = isInCart(product._id);

                return (
                  <div
                    key={product._id}
                    className={`group bg-white rounded-lg border hover:shadow-lg transition-all duration-300 overflow-hidden ${
                      outOfStock ? "border-red-200" : "border-gray-200"
                    }`}
                  >
                    {/* Product Image Container */}
                    <div className="relative overflow-hidden bg-gray-100">
                      <Link to={`/product/${product.slug}`}>
                        <img
                          src={product.images?.[0]?.url || "/placeholder.jpg"}
                          alt={product.images?.[0]?.alt || product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      </Link>

                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(product)}
                        disabled={loading}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm disabled:opacity-50"
                      >
                        <FaTrash size={14} />
                      </button>

                      {/* Product Badge */}
                      {badge && (
                        <div className="absolute top-3 left-3">
                          <span
                            className={`${badge.color} text-white px-2 py-1 rounded text-xs font-medium`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      )}

                      {/* Rating */}
                      {product.rating > 0 && (
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                          <FaStar className="text-yellow-400" size={10} />
                          <span>{product.rating?.toFixed(1) || "0.0"}</span>
                        </div>
                      )}

                      {/* In Cart Badge */}
                      {itemInCart && (
                        <div className="absolute bottom-3 right-3">
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                            In Cart
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link to={`/product/${product.slug}`}>
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {product.brand}
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </div>

                      {/* Price */}
                      {getDisplayPrice(product)}

                      {/* Stock Status */}
                      <p
                        className={`text-sm mt-2 ${
                          outOfStock
                            ? "text-red-600 font-medium"
                            : product.stock < 10
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {outOfStock
                          ? "Out of stock"
                          : product.stock < 10
                          ? `Only ${product.stock} left!`
                          : `${product.stock} in stock`}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={outOfStock || itemInCart || loading}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-medium transition-colors ${
                            outOfStock || itemInCart || loading
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          <FaShoppingCart size={12} />
                          {itemInCart ? "Added" : "Add to Cart"}
                        </button>
                        <button
                          onClick={() => handleBuyNow(product)}
                          disabled={outOfStock || loading}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-medium transition-colors ${
                            outOfStock || loading
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          <FaCreditCard size={12} />
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendations Section */}
            <div className="mt-12 bg-white rounded-lg p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  You Might Also Like
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover more products that match your style and preferences
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Recommendation placeholders */}
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="text-center">
                    <div className="bg-gray-100 rounded-lg h-32 mb-4 flex items-center justify-center">
                      <FaTag className="text-3xl text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Personalized recommendations
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => navigate("/shop")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Explore More Products
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
