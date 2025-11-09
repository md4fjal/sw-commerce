import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} from "../redux/slices/cartSlice";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaCreditCard,
  FaTag,
  FaStar,
  FaShieldAlt,
} from "react-icons/fa";
import Loader from "../components/loader";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const {
    cart,
    subtotal,
    taxAmount,
    shippingFee,
    totalAmount,
    totalQuantity,
    loading,
    error,
  } = useSelector((state) => state.cart);
  console.log("cart", cart);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart({ token }));
    }
  }, [dispatch, token]);

  const handleIncrement = async (item) => {
    const productId = item.product?._id;
    const currentQty = item.quantity;
    const stock = item.product?.stock || 0;

    if (!productId) return;

    if (currentQty >= stock) {
      alert(`Only ${stock} items available in stock`);
      return;
    }

    try {
      dispatch(incrementQuantity({ productId }));

      await dispatch(
        updateCartItem({
          token,
          productId,
          quantity: currentQty + 1,
        })
      ).unwrap();
    } catch (error) {
      alert(error || "Failed to update quantity");
      dispatch(fetchCart({ token }));
    }
  };

  const handleDecrement = async (item) => {
    const productId = item.product?._id;
    const currentQty = item.quantity;

    if (!productId) return;

    if (currentQty === 1) {
      handleRemoveItem(productId);
      return;
    }

    try {
      dispatch(decrementQuantity({ productId }));

      await dispatch(
        updateCartItem({
          token,
          productId,
          quantity: currentQty - 1,
        })
      ).unwrap();
    } catch (error) {
      alert(error || "Failed to update quantity");
      dispatch(fetchCart({ token }));
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!productId) return;

    if (
      window.confirm("Are you sure you want to remove this item from cart?")
    ) {
      try {
        await dispatch(removeFromCart({ token, productId })).unwrap();
      } catch (error) {
        alert(error || "Failed to remove item from cart");
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await dispatch(clearCart({ token })).unwrap();
      } catch (error) {
        alert(error || "Failed to clear cart");
      }
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Check if any items are out of stock or have insufficient stock
    const problematicItems = cart.filter((item) => {
      const product = item.product;
      return !product || product.stock === 0 || item.quantity > product.stock;
    });

    if (problematicItems.length > 0) {
      alert(
        "Some items in your cart have stock issues. Please update quantities or remove them before checkout."
      );
      return;
    }

    navigate("/checkout");
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
        </div>
      );
    }
    return (
      <p className="text-lg font-bold text-blue-600">
        ₹{price.toLocaleString()}
      </p>
    );
  };

  const calculateItemTotal = (item) => {
    if (!item.product) return 0;

    const price = item.product.salePrice || item.product.price || 0;
    return price * item.quantity;
  };

  // Calculate free shipping threshold (matching backend logic)
  const freeShippingThreshold = 1000;
  const amountToFreeShipping = freeShippingThreshold - (subtotal || 0);

  if (loading && cart.length === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Your Shopping Cart
          </h1>
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
              You need to be logged in to view your cart and start shopping.
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
        ) : cart.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to discover amazing products!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    Cart Items ({totalQuantity})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    disabled={loading}
                    className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaTrash size={14} />
                    {loading ? "Clearing..." : "Clear Cart"}
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => {
                    const product = item.product;
                    if (!product) return null;

                    const isOutOfStock = product.stock === 0;
                    const isLowStock =
                      product.stock > 0 && item.quantity > product.stock;
                    const canIncrement = item.quantity < product.stock;

                    return (
                      <div
                        key={item._id || `${product._id}-${Date.now()}`}
                        className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                          isOutOfStock
                            ? "border-red-200 bg-red-50"
                            : isLowStock
                            ? "border-orange-200 bg-orange-50"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <Link
                          to={`/product/${product.slug}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={product.images?.[0]?.url || "/placeholder.jpg"}
                            alt={product.images?.[0]?.alt || product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
                            }}
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${product.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            <h3 className="font-semibold text-gray-800 mb-1 truncate">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm text-gray-600">
                              Brand:{" "}
                              <span className="font-medium">
                                {product.brand}
                              </span>
                            </p>
                            {product.colors?.[0] && (
                              <span className="text-sm text-gray-600">
                                • Color:{" "}
                                <span className="font-medium">
                                  {product.colors[0]}
                                </span>
                              </span>
                            )}
                            {product.sizes?.[0] && (
                              <span className="text-sm text-gray-600">
                                • Size:{" "}
                                <span className="font-medium">
                                  {product.sizes[0]}
                                </span>
                              </span>
                            )}
                          </div>

                          {getDisplayPrice(product)}

                          {/* Stock Warning */}
                          {isOutOfStock && (
                            <p className="text-red-600 text-sm font-medium mt-1">
                              Out of Stock
                            </p>
                          )}
                          {isLowStock && (
                            <p className="text-orange-600 text-sm font-medium mt-1">
                              Only {product.stock} left in stock
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDecrement(item)}
                            disabled={isOutOfStock || loading}
                            className="w-8 h-8 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaMinus size={12} />
                          </button>

                          <span
                            className={`w-8 text-center font-medium ${
                              isOutOfStock ? "text-red-600" : "text-gray-800"
                            }`}
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => handleIncrement(item)}
                            disabled={isOutOfStock || !canIncrement || loading}
                            className="w-8 h-8 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-20">
                          <p className="font-bold text-gray-800">
                            ₹{calculateItemTotal(item).toLocaleString()}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(product._id)}
                          disabled={loading}
                          className="p-2 text-red-500 hover:text-red-600 transition-colors flex-shrink-0 disabled:opacity-50"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span>₹{(subtotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>₹{(taxAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-500">FREE</span>
                      ) : (
                        `₹${(shippingFee || 0).toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total Amount</span>
                      <span>₹{(totalAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={
                    loading ||
                    cart.length === 0 ||
                    cart.some((item) => {
                      const product = item.product;
                      return (
                        !product ||
                        product.stock === 0 ||
                        item.quantity > product.stock
                      );
                    })
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCreditCard />
                  {loading ? "Processing..." : "Proceed to Checkout"}
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate("/shop")}
                  disabled={loading}
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Continue Shopping
                </button>

                {/* Free Shipping Notice */}
                {subtotal < freeShippingThreshold && subtotal > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm text-center">
                    Add ₹{Math.max(0, amountToFreeShipping).toLocaleString()}{" "}
                    more for FREE shipping!
                  </div>
                )}

                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-center gap-4 text-gray-500">
                    <div className="text-center">
                      <FaShieldAlt className="mx-auto mb-1" />
                      <span className="text-xs">Secure Payment</span>
                    </div>
                    <div className="text-center">
                      <FaTag className="mx-auto mb-1" />
                      <span className="text-xs">Best Price</span>
                    </div>
                    <div className="text-center">
                      <FaStar className="mx-auto mb-1" />
                      <span className="text-xs">Quality Assured</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
