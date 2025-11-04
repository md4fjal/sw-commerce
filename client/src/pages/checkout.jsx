import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createRazorpayOrder,
  verifyPayment,
  clearPaymentState,
  resetOrder,
} from "../redux/slices/paymentSlice";
import { clearCart } from "../redux/slices/cartSlice";
import {
  FaCreditCard,
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import Loader from "../components/loader";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector((state) => state.auth);
  const { cart, subtotal, taxAmount, shippingFee, totalAmount } = useSelector(
    (state) => state.cart
  );
  const { loading, success, error } = useSelector((state) => state.payment);

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    dispatch(clearPaymentState());
  }, [dispatch]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setPaymentProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Please try again.");
        setPaymentProcessing(false);
        return;
      }

      const result = await dispatch(createRazorpayOrder({ token })).unwrap();

      const {
        key,
        orderId: razorpayOrderId,
        amount,
        currency,
        dbOrderId,
      } = result;

      if (!key || !razorpayOrderId || !amount) {
        throw new Error("Invalid Razorpay order response");
      }

      const options = {
        key,
        amount,
        currency,
        name: "FashionStore",
        description: `Order for ${cart.length} item(s)`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verificationResult = await dispatch(
              verifyPayment({
                token,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId,
              })
            ).unwrap();

            if (verificationResult.success) {
              dispatch(clearCart({ token }));
              dispatch(resetOrder());
              navigate("/order-success", {
                state: { order: verificationResult.order },
              });
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name || "Test User",
          email: user?.email || "test@example.com",
          contact: user?.phone || "9999999999",
        },
        notes: {
          address: "FashionStore Order",
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: () => setPaymentProcessing(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setPaymentProcessing(false);
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment initialization error:", err);
      alert(err.message || "Failed to initialize payment. Please try again.");
      setPaymentProcessing(false);
    }
  };

  if (loading || paymentProcessing) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft />
            Back to Cart
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.product?._id}
                    className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg"
                  >
                    <img
                      src={item.product?.images}
                      alt={item.product?.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {item.product?.name}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        ${item.product?.price} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-gray-800">
                      ${item.product?.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
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
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total Amount</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Delivery Address
              </h2>
              {user?.address ? (
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-600">{user.address}</p>
                  <p className="text-gray-600">Phone: {user.phone}</p>
                </div>
              ) : (
                <div className="p-4 border border-amber-200 rounded-lg bg-amber-50 text-amber-700">
                  <FaExclamationTriangle className="inline mr-2" />
                  Please update your delivery address in your profile.
                </div>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">
                Payment Method
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                  <FaCheckCircle className="inline mr-2" />
                  Order created successfully!
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 text-blue-700 mb-2">
                  <FaCreditCard />
                  <span className="font-medium">Razorpay</span>
                </div>
                <p className="text-sm text-blue-600">
                  Secure payment powered by Razorpay
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                <FaLock />
                <span>100% Secure Payments</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || cart.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaCreditCard />
                Pay ${totalAmount}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By completing your purchase, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
