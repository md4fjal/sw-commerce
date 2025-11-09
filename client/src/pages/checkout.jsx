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
  FaRupeeSign,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaBox,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";
import Loader from "../components/loader";
import { fetchAddress, clearAddressError } from "../redux/slices/addressSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector((state) => state.auth);
  const {
    shippingAddress,
    loading: addressLoading,
    error: addressError,
  } = useSelector((state) => state.address);

  const { cart, subtotal, taxAmount, shippingFee, totalAmount } = useSelector(
    (state) => state.cart
  );
  const { loading, success, error } = useSelector((state) => state.payment);

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    dispatch(clearPaymentState());
    dispatch(clearAddressError());
    if (token) {
      dispatch(fetchAddress({ token }));
    }
  }, [dispatch, token]);

  // Check if shipping address is complete
  const isAddressValid =
    shippingAddress &&
    shippingAddress.streetAddress &&
    shippingAddress.city &&
    shippingAddress.state &&
    shippingAddress.pinCode &&
    shippingAddress.phone;

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

    const outOfStockItems = cart.filter((item) => item.product?.stock === 0);
    if (outOfStockItems.length > 0) {
      alert(
        "Some items in your cart are out of stock. Please remove them before proceeding."
      );
      return;
    }

    const lowStockItems = cart.filter(
      (item) => item.quantity > item.product?.stock
    );
    if (lowStockItems.length > 0) {
      alert(
        "Some items in your cart have insufficient stock. Please adjust quantities before proceeding."
      );
      return;
    }

    if (!isAddressValid) {
      alert("Please set up your complete shipping address before proceeding.");
      navigate("/profile");
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

      const result = await dispatch(
        createRazorpayOrder({
          token,
          shippingAddress,
        })
      ).unwrap();

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
        currency: currency || "INR",
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
                state: {
                  order: verificationResult.order,
                  paymentId: response.razorpay_payment_id,
                },
              });
            } else {
              alert("Payment verification failed. Please contact support.");
              setPaymentProcessing(false);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: user?.firstname + " " + user?.lastname || "Customer",
          email: user?.email || "customer@example.com",
          contact: shippingAddress?.phone || user?.phone || "9999999999",
        },
        notes: {
          shipping_address: JSON.stringify(shippingAddress),
          user_id: user?._id,
        },
        theme: {
          color: "#2563eb",
          hide_topbar: false,
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
            console.log("Payment modal dismissed");
          },
          escape: true,
          backdropclose: false,
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        timeout: 300,
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setPaymentProcessing(false);
      });

      razorpay.on("payment.error", (response) => {
        console.error("Payment error:", response.error);
        alert(`Payment error: ${response.error.description}`);
        setPaymentProcessing(false);
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment initialization error:", err);
      alert(err.message || "Failed to initialize payment. Please try again.");
      setPaymentProcessing(false);
    }
  };

  const calculateItemTotal = (item) => {
    const price = item.product?.salePrice || item.product?.price || 0;
    return price * item.quantity;
  };

  const getDisplayPrice = (product) => {
    if (product.salePrice && product.salePrice < product.price) {
      return (
        <div className="flex items-center gap-2">
          <p className="font-bold text-green-600 flex items-center">
            <FaRupeeSign size={12} />
            {product.salePrice.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 line-through flex items-center">
            <FaRupeeSign size={10} />
            {product.price.toLocaleString()}
          </p>
        </div>
      );
    }
    return (
      <p className="font-bold text-blue-600 flex items-center">
        <FaRupeeSign size={12} />
        {product.price.toLocaleString()}
      </p>
    );
  };

  if (loading || paymentProcessing || addressLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaBox />
                Order Summary ({cart.length}{" "}
                {cart.length === 1 ? "item" : "items"})
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => {
                  const product = item.product;
                  const isLowStock =
                    product?.stock > 0 && product?.stock < item.quantity;

                  return (
                    <div
                      key={item._id}
                      className={`flex items-center gap-4 p-4 border rounded-lg ${
                        isLowStock
                          ? "border-orange-200 bg-orange-50"
                          : "border-gray-100"
                      }`}
                    >
                      <img
                        src={product?.images?.[0]?.url || "/placeholder.jpg"}
                        alt={product?.images?.[0]?.alt || product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {product?.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                          <span>Brand: {product?.brand}</span>
                          {item.color && <span>• Color: {item.color}</span>}
                          {item.size && <span>• Size: {item.size}</span>}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          {getDisplayPrice(product)}
                          <span className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        {isLowStock && (
                          <p className="text-orange-600 text-xs font-medium mt-1">
                            Only {product.stock} left in stock
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800 flex items-center justify-end">
                          <FaRupeeSign size={14} />
                          {calculateItemTotal(item).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 border-t pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal (
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </span>
                  <span className="flex items-center">
                    <FaRupeeSign size={12} />
                    {subtotal?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span className="flex items-center">
                    <FaRupeeSign size={12} />
                    {taxAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-500 flex items-center">
                        FREE
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FaRupeeSign size={12} />
                        {shippingFee?.toLocaleString()}
                      </span>
                    )}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total Amount</span>
                    <span className="flex items-center">
                      <FaRupeeSign size={16} />
                      {totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section with Improved Loading and Error States */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt />
                Delivery Address
                {addressLoading && (
                  <span className="text-sm text-gray-500">(Loading...)</span>
                )}
              </h2>

              {addressError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  <FaExclamationTriangle className="inline mr-2" />
                  Failed to load address: {addressError}
                  <button
                    onClick={() => dispatch(fetchAddress({ token }))}
                    className="ml-2 text-red-800 underline hover:text-red-900 font-medium"
                  >
                    Retry
                  </button>
                </div>
              )}

              {addressLoading ? (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ) : isAddressValid ? (
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FaUser className="text-green-600" />
                        <p className="font-semibold text-gray-800 capitalize">
                          {user?.firstname} {user?.lastname}
                        </p>
                      </div>

                      <p className="text-gray-700 mb-2">
                        {shippingAddress.streetAddress}
                      </p>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          {shippingAddress.city}, {shippingAddress.state} -{" "}
                          {shippingAddress.pinCode}
                        </p>
                        <p>{shippingAddress.country}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-700">
                        <FaPhone size={12} />
                        <span>{shippingAddress.phone}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/profile")}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    Change Address
                  </button>
                </div>
              ) : (
                <div className="p-4 border border-amber-200 rounded-lg bg-amber-50 text-amber-700">
                  <FaExclamationTriangle className="inline mr-2" />
                  {shippingAddress
                    ? "Please complete your delivery address with all required fields."
                    : "Please add a delivery address to proceed with your order."}
                  <button
                    onClick={() => navigate("/profile")}
                    className="ml-2 text-amber-800 underline hover:text-amber-900 font-medium"
                  >
                    {shippingAddress ? "Complete Address" : "Add Address"}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaShieldAlt />
                100% Secure Checkout
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3">
                  <FaLock className="text-green-500 text-xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    SSL Secure
                  </p>
                  <p className="text-xs text-gray-500">256-bit Encryption</p>
                </div>
                <div className="p-3">
                  <FaShieldAlt className="text-blue-500 text-xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Safe & Secure
                  </p>
                  <p className="text-xs text-gray-500">Payment Protection</p>
                </div>
                <div className="p-3">
                  <FaTruck className="text-purple-500 text-xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Fast Delivery
                  </p>
                  <p className="text-xs text-gray-500">Across India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaCreditCard />
                Payment Method
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  <FaExclamationTriangle className="inline mr-2" />
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
                  <span className="font-semibold">Razorpay</span>
                </div>
                <p className="text-sm text-blue-600 mb-2">
                  Secure payment powered by Razorpay
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-500">
                  <FaLock size={10} />
                  <span>PCI DSS Compliant</span>
                </div>
              </div>

              {/* Order Total */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Order Total:</span>
                  <span className="text-xl font-bold text-blue-600 flex items-center">
                    <FaRupeeSign size={16} />
                    {totalAmount?.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Including all taxes and shipping
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6 p-3 bg-gray-50 rounded-lg">
                <FaLock className="text-green-500" />
                <span className="font-medium">100% Secure Payments</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={
                  loading ||
                  cart.length === 0 ||
                  !isAddressValid ||
                  addressLoading
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                <FaCreditCard />
                <span>Pay ₹{totalAmount?.toLocaleString()}</span>
              </button>

              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-500 text-center">
                  By completing your purchase, you agree to our{" "}
                  <button className="text-blue-600 hover:underline">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button className="text-blue-600 hover:underline">
                    Privacy Policy
                  </button>
                </p>
                <p className="text-xs text-gray-400 text-center">
                  Your payment is secured with bank-level encryption
                </p>
              </div>

              <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  Need help?{" "}
                  <button className="text-blue-600 hover:underline font-medium">
                    Contact Support
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
