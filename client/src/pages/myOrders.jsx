import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getMyOrders, cancelOrder } from "../redux/slices/paymentSlice";
import {
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUndo,
  FaEye,
  FaFilter,
  FaRupeeSign,
  FaBox,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Loader from "../components/loader";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.payment);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (token) {
      dispatch(getMyOrders({ token }));
    }
  }, [dispatch, token]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await dispatch(cancelOrder({ token, orderId })).unwrap();
        dispatch(getMyOrders({ token }));
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
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
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

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.orderStatus?.toLowerCase() === filter.toLowerCase();
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <div className="w-24"></div>
        </div>

        {!token ? (
          // Not logged in state
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Please Login
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You need to be logged in to view your order history.
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
        ) : orders.length === 0 ? (
          // Empty Orders State
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <div className="text-xl font-bold text-blue-600">
                  {orders.length}
                </div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <div className="text-xl font-bold text-green-600">
                  {
                    orders.filter(
                      (o) =>
                        o.orderStatus?.toLowerCase() === "delivered" ||
                        o.orderStatus?.toLowerCase() === "completed"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Delivered</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <div className="text-xl font-bold text-yellow-600">
                  {
                    orders.filter(
                      (o) =>
                        o.orderStatus?.toLowerCase() === "pending" ||
                        o.orderStatus?.toLowerCase() === "processing"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <div className="text-xl font-bold text-red-600">
                  {
                    orders.filter(
                      (o) => o.orderStatus?.toLowerCase() === "cancelled"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-blue-500" />
                  <span className="font-medium text-gray-700">Filter by:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "all",
                    "pending",
                    "processing",
                    "shipped",
                    "delivered",
                    "completed",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1 rounded text-sm font-medium capitalize transition-colors ${
                        filter === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          Order #{order._id?.slice(-8).toUpperCase()}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span>Placed on {formatDate(order.createdAt)}</span>
                          {order.shippingAddress && (
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt size={12} />
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.state}
                            </span>
                          )}
                        </div>
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
                          <FaRupeeSign size={16} />
                          {order.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FaBox />
                        Items ({order.orderItems?.length || 0})
                      </h4>
                      <div className="space-y-3">
                        {order.orderItems?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0"
                          >
                            <img
                              src={
                                item.product?.images?.[0]?.url ||
                                "/placeholder.jpg"
                              }
                              alt={
                                item.product?.images?.[0]?.alt ||
                                item.product?.name
                              }
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 truncate">
                                {item.product?.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                <span>Qty: {item.quantity}</span>
                                {item.color && (
                                  <span>• Color: {item.color}</span>
                                )}
                                {item.size && <span>• Size: {item.size}</span>}
                              </div>
                              <p className="text-sm text-gray-600">
                                Brand: {item.product?.brand}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-800 flex items-center justify-end">
                                <FaRupeeSign size={12} />
                                {calculateItemTotal(item).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                <FaRupeeSign size={10} />
                                {item.price?.toLocaleString()} each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Payment:</strong>{" "}
                          <span className="capitalize">
                            {order.paymentInfo?.status || "Paid"}
                          </span>
                        </p>
                        {order.paymentInfo?.razorpay_payment_id && (
                          <p>
                            <strong>Payment ID:</strong>{" "}
                            {order.paymentInfo.razorpay_payment_id.slice(-8)}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <FaEye size={12} />
                          View Details
                        </button>
                        {(order.orderStatus === "pending" ||
                          order.orderStatus === "processing") && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            <FaTimesCircle size={12} />
                            Cancel Order
                          </button>
                        )}
                        {order.orderStatus === "delivered" && (
                          <button
                            onClick={() => {
                              /* Handle return/reorder */
                            }}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            <FaUndo size={12} />
                            Buy Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty Filter State */
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                <div className="text-4xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  No {filter} orders
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {`You don't have any ${filter} orders at the moment.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setFilter("all")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    View All Orders
                  </button>
                  <button
                    onClick={() => navigate("/shop")}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <FaTimesCircle className="text-red-500 text-2xl mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-800 mb-2">
              Failed to load orders
            </h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => dispatch(getMyOrders({ token }))}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <FaUndo />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
