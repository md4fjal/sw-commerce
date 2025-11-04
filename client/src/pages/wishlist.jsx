import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../redux/slices/wishlistSlice";
import { addToCart } from "../redux/slices/cartSlice";
import {
  FaHeart,
  FaTrash,
  FaShoppingCart,
  FaArrowLeft,
  FaStar,
  FaCreditCard,
} from "react-icons/fa";
import Loader from "../components/loader";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  const { wishlist, loading } = useSelector((state) => state.wishlist);

  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist({ token, productId }));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ token, productId: product._id, quantity: 1 }));
  };

  const handleBuyNow = (product) => {
    dispatch(addToCart({ token, productId: product._id, quantity: 1 }));
    navigate("/cart");
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((product) => {
      dispatch(addToCart({ token, productId: product._id, quantity: 1 }));
    });
  };

  const isInCart = (productId) => {
    return cart.some((item) => item.product?._id === productId);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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

        {/* Actions Bar */}
        {wishlist.length > 0 && (
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-red-600">
                <FaHeart className="fill-current" />
                <span className="font-medium">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"}{" "}
                  in wishlist
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleMoveAllToCart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <FaShoppingCart />
                  Move All to Cart
                </button>
                <button
                  onClick={() => navigate("/shop")}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}

        {wishlist.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Product Image Container */}
                <div
                  className="relative overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.images}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(product._id);
                    }}
                    className="absolute top-2 right-2 p-2 rounded bg-white/80 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {product.category?.name}
                    </span>
                  </div>

                  {/* In Cart Badge */}
                  {isInCart(product._id) && (
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                        In Cart
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div
                    className="mb-3 cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {product.name}
                    </h2>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={
                              star <= (product.rating || 4)
                                ? "fill-current"
                                : "text-gray-300"
                            }
                            size={12}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-1">
                        (
                        {product.reviews || Math.floor(Math.random() * 100) + 1}
                        )
                      </span>
                    </div>
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
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      <FaShoppingCart />
                      {isInCart(product._id) ? "Added" : "Cart"}
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      <FaCreditCard /> Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recently Viewed Section Suggestion */}
        {wishlist.length > 0 && (
          <div className="mt-12 bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              You Might Also Like
            </h2>
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Discover more products that match your style
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Explore More Products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
