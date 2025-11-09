import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaCreditCard,
  FaBox,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaShippingFast,
} from "react-icons/fa";
import { cancelOrder } from "../redux/slices/paymentSlice";
import Loader from "../components/loader";
import { getOrderById } from "../redux/slices/orderSlice";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.payment);
  const { order } = useSelector((state) => state.order);

  useEffect(() => {
    if (token && orderId) {
      dispatch(getOrderById({ token, orderId }));
    }
  }, [dispatch, token, orderId]);

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await dispatch(cancelOrder({ token, orderId })).unwrap();
        await dispatch(getOrderById({ token, orderId })).unwrap();
        alert("Order cancelled successfully!");
      } catch (error) {
        alert("Failed to cancel order: " + error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      case "processing":
        return <FaClock className="text-blue-500" />;
      case "shipped":
        return <FaTruck className="text-purple-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateItemTotal = (item) => {
    return (item.price || 0) * (item.quantity || 1);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <FaTimesCircle className="text-red-500 text-3xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Failed to load order details
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/my-orders")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Order Not Found
          </h2>
          <button
            onClick={() => navigate("/my-orders")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft />
            Back to Orders
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Order #{order._id?.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-gray-600">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium border ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus?.charAt(0).toUpperCase() +
                      order.orderStatus?.slice(1)}
                  </span>
                  <p className="text-xl font-bold text-blue-600 flex items-center">
                    <FaRupeeSign size={18} />
                    {order.totalAmount?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaBox />
                  Order Items ({order.orderItems?.length || 0})
                </h3>
                {order.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.product?.images?.[0]?.url || "/placeholder.jpg"}
                      alt={item.product?.images?.[0]?.alt || item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product?.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        <h4 className="font-semibold text-gray-800">
                          {item.product?.name}
                        </h4>
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                        <span>Brand: {item.product?.brand}</span>
                        {item.color && <span>• Color: {item.color}</span>}
                        {item.size && <span>• Size: {item.size}</span>}
                      </div>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 flex items-center justify-end">
                        <FaRupeeSign size={14} />
                        {calculateItemTotal(item).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        <FaRupeeSign size={12} />
                        {item.price?.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <FaMapMarkerAlt />
                  Shipping Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Recipient</p>
                    <p className="font-medium flex items-center gap-2">
                      <FaUser size={12} />
                      {order.shippingAddress.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-medium flex items-center gap-2">
                      <FaPhone size={12} />
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} -{" "}
                      {order.shippingAddress.pincode}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <FaCreditCard />
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-medium capitalize">
                    {order.paymentInfo?.status || "Paid"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">
                    {order.paymentInfo?.method || "Razorpay"}
                  </p>
                </div>
                {order.paymentInfo?.razorpay_payment_id && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Payment ID</p>
                    <p className="font-medium font-mono">
                      {order.paymentInfo.razorpay_payment_id}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-medium text-green-600 flex items-center">
                    <FaRupeeSign size={14} />
                    {order.paymentInfo?.amount ||
                      order.totalAmount?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Actions */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Actions
              </h3>
              <div className="space-y-3">
                {(order.orderStatus === "pending" ||
                  order.orderStatus === "processing") && (
                  <button
                    onClick={handleCancelOrder}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <FaTimesCircle />
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={() => navigate("/shop")}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <FaBox />
                  Continue Shopping
                </button>
                {order.orderStatus === "delivered" && (
                  <button
                    onClick={() => {
                      /* Handle return */
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <FaUndo />
                    Return Item
                  </button>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Order Placed</p>
                    <p className="text-xs text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      order.paymentInfo?.status === "paid"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-sm">Payment Confirmed</p>
                    <p className="text-xs text-gray-600">
                      {order.paymentInfo?.status === "paid"
                        ? formatDate(order.createdAt)
                        : "Pending"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      [
                        "processing",
                        "shipped",
                        "delivered",
                        "completed",
                      ].includes(order.orderStatus)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-sm">Order Processed</p>
                    <p className="text-xs text-gray-600">
                      {["shipped", "delivered", "completed"].includes(
                        order.orderStatus
                      )
                        ? formatDate(order.updatedAt)
                        : "In progress"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      order.orderStatus === "shipped"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-sm">Shipped</p>
                    <p className="text-xs text-gray-600">
                      {order.orderStatus === "shipped"
                        ? formatDate(order.updatedAt)
                        : "Pending"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      order.orderStatus === "delivered" ||
                      order.orderStatus === "completed"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-sm">Delivered</p>
                    <p className="text-xs text-gray-600">
                      {order.orderStatus === "delivered" ||
                      order.orderStatus === "completed"
                        ? formatDate(order.updatedAt)
                        : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="flex items-center">
                    <FaRupeeSign size={10} />
                    {(
                      order.totalAmount -
                      (order.taxAmount || 0) -
                      (order.shippingFee || 0)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="flex items-center">
                    {order.shippingFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <>
                        <FaRupeeSign size={10} />
                        {order.shippingFee?.toLocaleString()}
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="flex items-center">
                    <FaRupeeSign size={10} />
                    {order.taxAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="flex items-center">
                      <FaRupeeSign size={12} />
                      {order.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
