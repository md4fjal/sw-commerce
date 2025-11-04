import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  FaShoppingBag,
  FaArrowLeft,
  FaCreditCard,
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
  } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart({ token }));
  }, [dispatch, token]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart({ token, productId }));
    } else {
      dispatch(updateCartItem({ token, productId, quantity: newQuantity }));
    }
  };

  const handleIncrement = (productId, currentQty) => {
    dispatch(incrementQuantity({ productId }));
    dispatch(
      updateCartItem({
        token,
        productId,
        quantity: currentQty + 1,
      })
    );
  };

  const handleDecrement = (productId, currentQty) => {
    if (currentQty === 1) {
      dispatch(removeFromCart({ token, productId }));
      return;
    }

    dispatch(decrementQuantity({ productId }));
    dispatch(
      updateCartItem({
        token,
        productId,
        quantity: currentQty - 1,
      })
    );
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ token, productId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart({ token }));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
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
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Your Shopping Cart
          </h1>
          <div className="w-24"></div>
        </div>

        {cart.length === 0 ? (
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    Cart Items ({totalQuantity})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center gap-2"
                  >
                    <FaTrash size={14} />
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product?._id}
                      className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={item.product?.images}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.product?.name}
                        </h3>
                        <p className="text-blue-600 font-bold">
                          ${item.product?.price}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleDecrement(item.product._id, item.quantity)
                          }
                          className="w-8 h-8 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <FaMinus size={12} />
                        </button>

                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleIncrement(item.product._id, item.quantity)
                          }
                          className="w-8 h-8 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.product?._id)}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
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
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>${taxAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-500">FREE</span>
                      ) : (
                        `$${shippingFee}`
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total Amount</span>
                      <span>${totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FaCreditCard />
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate("/shop")}
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Free Shipping Notice */}
                {subtotal < 1000 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm text-center">
                    Add ${1000 - subtotal} more for FREE shipping!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
