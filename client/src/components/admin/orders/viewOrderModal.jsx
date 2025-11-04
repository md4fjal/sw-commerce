import {
  FaTimes,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBox,
  FaShoppingBag,
  FaReceipt,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

const ViewOrderModal = ({ order, onClose }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaShoppingBag className="text-blue-600 text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Order Details
              </h2>
              <p className="text-sm text-gray-500">
                Detailed order and payment information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500 text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[85vh] custom-scrollbar">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <FaUser className="text-blue-500 text-sm" />
                <div>
                  <p className="text-xs text-gray-600">Customer Email</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {order.user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <FaBox className="text-purple-500 text-sm" />
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <FaCreditCard className="text-green-500 text-sm" />
                <div>
                  <p className="text-xs text-gray-600">Total Amount</p>
                  <p className="text-sm font-bold text-gray-900">
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <FaInfoCircle className="text-blue-500 text-sm" />
              <h3 className="text-sm font-semibold text-gray-900">
                Order Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-gray-900">
                  {order._id || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-medium text-gray-900">
                  {order.user?._id || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          {order.shippingInfo && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <FaMapMarkerAlt className="text-orange-500 text-sm" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Shipping Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {Object.entries({
                  Address: order.shippingInfo.address,
                  City: order.shippingInfo.city,
                  State: order.shippingInfo.state,
                  Country: order.shippingInfo.country,
                  "Pin Code": order.shippingInfo.pinCode,
                  Phone: order.shippingInfo.phoneNo,
                }).map(
                  ([label, value]) =>
                    value && (
                      <div key={label} className="flex justify-between">
                        <span className="text-gray-600">{label}:</span>
                        <span className="font-medium text-gray-900">
                          {value}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* Payment Info */}
          {order.paymentInfo && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <FaCreditCard className="text-green-500 text-sm" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Payment Information
                </h3>
              </div>
              <div className="space-y-1 text-sm">
                {Object.entries({
                  "Payment ID": order.paymentInfo.razorpay_payment_id,
                  "Order ID": order.paymentInfo.razorpay_order_id,
                  Status: order.paymentInfo.status,
                  Currency: order.paymentInfo.currency,
                  Amount: `₹${order.paymentInfo.amount?.toLocaleString(
                    "en-IN"
                  )}`,
                }).map(
                  ([label, value]) =>
                    value && (
                      <div
                        key={label}
                        className="flex justify-between border-b border-gray-100 py-1"
                      >
                        <span className="text-gray-600">{label}:</span>
                        <span className="font-medium text-gray-900 truncate">
                          {value}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 p-3 bg-gray-50 border-b border-gray-200">
              <FaReceipt className="text-purple-500 text-sm" />
              <h3 className="text-sm font-semibold text-gray-900">
                Order Items
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded border border-gray-300"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{item.price?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              {[
                { label: "Items Total", value: order.itemsPrice },
                { label: "Tax", value: order.taxPrice },
                { label: "Shipping", value: order.shippingPrice },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-gray-600">{item.label}:</span>
                  <span className="font-medium text-gray-900">
                    ₹{item.value?.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="font-bold text-blue-600">
                  ₹{order.totalAmount?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
              <FaCalendarAlt className="text-blue-500 text-sm" />
              <div>
                <p className="text-xs text-blue-600">Order Created</p>
                <p className="text-sm text-gray-900">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {order.updatedAt && (
              <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                <FaCalendarAlt className="text-green-500 text-sm" />
                <div>
                  <p className="text-xs text-green-600">Last Updated</p>
                  <p className="text-sm text-gray-900">
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional CSS for hidden scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ViewOrderModal;
