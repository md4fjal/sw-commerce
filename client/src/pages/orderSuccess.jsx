import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearPaymentState } from "../redux/slices/paymentSlice";
import { FaCheckCircle, FaShoppingBag, FaHome, FaList } from "react-icons/fa";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { order } = location.state || {};
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearPaymentState());

    return () => {
      dispatch(clearPaymentState());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-green-500" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-2">
            Thank you for your purchase, {user?.name}!
          </p>
          <p className="text-gray-600 mb-6">
            Your order has been successfully placed and is being processed.
          </p>

          {/* Order Details */}
          {order && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Details
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium text-green-600">
                    ${order.totalAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-medium">Completed</span>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Email */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-blue-700 text-sm">
              A confirmation email has been sent to {user?.email}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/shop")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <FaShoppingBag />
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/my-orders")}
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <FaList />
              View Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <FaHome />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
