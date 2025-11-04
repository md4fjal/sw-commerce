import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaTags,
  FaBox,
  FaClipboardList,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-purple-100 text-purple-700 border-l-4 border-purple-500"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: FaTachometerAlt,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: FaUsers,
    },
    {
      path: "/admin/categories",
      label: "Categories",
      icon: FaTags,
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: FaBox,
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: FaClipboardList,
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 p-6 flex flex-col h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        {user && (
          <p className="text-sm text-gray-600 mt-1">
            Welcome, {user.firstname}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path} className={linkClasses}>
              <Icon className="text-lg" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-2 border-t border-gray-200 pt-4">
        <NavLink
          to="/change-password"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`
          }
        >
          <FaLock className="text-lg" />
          <span>Change Password</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
