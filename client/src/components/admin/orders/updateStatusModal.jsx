// UpdateStatusModal.jsx
import { useState } from "react";
import {
  FaTimes,
  FaCheck,
  FaShippingFast,
  FaClock,
  FaCheckCircle,
  FaBan,
  FaCog,
} from "react-icons/fa";

const UpdateStatusModal = ({ order, onClose, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(
    order?.orderStatus || ""
  );

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: FaClock,
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-blue-100 text-blue-800",
      icon: FaCog,
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-indigo-100 text-indigo-800",
      icon: FaShippingFast,
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: FaCheckCircle,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
      icon: FaBan,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStatus && selectedStatus !== order.orderStatus) {
      onStatusUpdate(selectedStatus);
    } else {
      onClose();
    }
  };

  const currentStatus = statusOptions.find(
    (s) => s.value === order?.orderStatus
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaShippingFast className="text-blue-600 text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Update Status
              </h2>
              <p className="text-sm text-gray-500">Change order status</p>
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
        <div className="p-4">
          {/* Order Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono font-semibold text-gray-900">
              #{order?._id?.slice(-8)}
            </p>
          </div>

          {/* Current Status */}
          {currentStatus && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-1">
                Current Status
              </p>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${currentStatus.color}`}
                >
                  {currentStatus.label}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Status Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((status) => {
                  const IconComponent = status.icon;
                  return (
                    <label
                      key={status.value}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedStatus === status.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={selectedStatus === status.value}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <IconComponent className="text-gray-600 text-sm" />
                      <span className="text-sm text-gray-700">
                        {status.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !selectedStatus || selectedStatus === order?.orderStatus
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <FaCheck className="text-sm" />
                <span>Update</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
