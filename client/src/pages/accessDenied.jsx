import { FaLock, FaHome, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-100 rounded-full">
            <FaLock className="text-3xl text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
          >
            <FaHome className="text-sm" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <FaArrowLeft className="text-sm" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
