import { useSelector, useDispatch } from "react-redux";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaStore,
  FaHome,
  FaTags,
  FaEnvelope,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { fetchMe, logout } from "../redux/slices/authSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchCart } from "../redux/slices/cartSlice";
import { fetchWishlist } from "../redux/slices/wishlistSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { token, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (token) {
      Promise.all([
        dispatch(fetchCart({ token })),
        dispatch(fetchWishlist({ token })),
        dispatch(fetchMe({ token })),
      ]);
    }
  }, [dispatch, token]);

  const isLoggedIn = Boolean(token);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/login");
    setIsProfileDropdownOpen(false);
  };

  const navItems = [
    { label: "Home", icon: FaHome, path: "/" },
    { label: "Shop", icon: FaStore, path: "/shop" },
    { label: "About Us", icon: FaTags, path: "/about" },
    { label: "Contact", icon: FaEnvelope, path: "/contact" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileDropdownOpen]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>

            <div
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <GiClothes className="text-xl text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StyleHub
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200 group"
              >
                <item.icon className="text-sm group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Wishlist */}
            <button
              onClick={() => navigate(isLoggedIn ? "/wishlist" : "/login")}
              className="relative p-2 text-gray-600 hover:text-red-500 transition-all duration-200 hover:scale-105"
            >
              <FaHeart className="text-xl" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate(isLoggedIn ? "/cart" : "/login")}
              className="relative p-2 text-gray-600 hover:text-green-600 transition-all duration-200 hover:scale-105"
            >
              <FaShoppingCart className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="relative profile-dropdown">
                {/* Profile Dropdown Trigger */}
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group border border-gray-200"
                >
                  <div className="p-1.5 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <FaUser className="text-sm text-blue-600" />
                  </div>
                  <span className="hidden sm:inline font-medium max-w-24 truncate">
                    {user?.firstname || "Profile"}
                  </span>
                  <FaChevronDown
                    className={`text-xs text-gray-400 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.firstname} {user?.lastname}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Profile Link */}
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    >
                      <FaUser className="text-gray-400" />
                      <span>My Profile</span>
                    </button>

                    {/* Admin Dashboard */}
                    {user?.role === "admin" && (
                      <button
                        onClick={() => {
                          navigate("/admin");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                      >
                        <FaTachometerAlt className="text-gray-400" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-all duration-200 border-t border-gray-100"
                    >
                      <FaSignOutAlt className="text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 text-sm sm:text-base"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="hidden sm:block px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-40">
            {/* Navigation Links */}
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <item.icon className="text-lg" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Auth Section for Mobile */}
            {!isLoggedIn && (
              <div className="px-4 py-3 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => handleNavigation("/login")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="w-full px-4 py-3 border-2 border-blue-500 text-blue-600 rounded-lg font-medium text-center"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
