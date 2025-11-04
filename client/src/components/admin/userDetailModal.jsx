// UserDetailModal.jsx
import {
  FaEnvelope,
  FaUser,
  FaCalendar,
  FaUserShield,
  FaTimes,
} from "react-icons/fa";

const UserDetailModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">User Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500 text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="mb-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.firstname?.[0]?.toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {user.firstname} {user.lastname}
            </h3>
            <p className="text-gray-500 text-sm mb-4">Registered User</p>

            {/* Details */}
            <div className="w-full space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-blue-500 text-sm" />
                <div className="text-left">
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaUserShield className="text-purple-500 text-sm" />
                <div className="text-left">
                  <p className="text-xs text-gray-600">Role</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FaCalendar className="text-green-500 text-sm" />
                <div className="text-left">
                  <p className="text-xs text-gray-600">Member Since</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-center mt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
