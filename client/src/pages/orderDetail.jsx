import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaCreditCard,
  FaBox,
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
    dispatch(getOrderById({ token, orderId }));
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
      <div className="max-w-4xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium border ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus?.charAt(0).toUpperCase() +
                      order.orderStatus?.slice(1)}
                  </span>
                  <p className="text-xl font-bold text-blue-600">
                    ${order.totalAmount}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaBox />
                  Order Items
                </h3>
                {order.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.product?.images}
                      alt={item.product?.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {item.product?.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Price: ${item.price}
                      </p>
                    </div>
                    <p className="font-bold text-gray-800">
                      ${item.quantity * item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

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
                    {order.paymentInfo?.status || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment ID</p>
                  <p className="font-medium">
                    {order.paymentInfo?.razorpay_payment_id || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-medium text-green-600">
                    ${order.paymentInfo?.amount || order.totalAmount}
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
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Order Placed</p>
                    <p className="text-xs text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      order.orderStatus !== "pending"
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
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      ["processing", "shipped", "completed"].includes(
                        order.orderStatus
                      )
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-sm">Order Processed</p>
                    <p className="text-xs text-gray-600">
                      {order.updatedAt !== order.createdAt
                        ? formatDate(order.updatedAt)
                        : "In progress"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      order.orderStatus === "completed"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-sm">Order Completed</p>
                    <p className="text-xs text-gray-600">
                      {order.orderStatus === "completed"
                        ? formatDate(order.updatedAt)
                        : "Pending"}
                    </p>
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
