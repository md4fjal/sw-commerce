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
} from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { fetchMe, logout } from "../redux/slices/authSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { fetchCart } from "../redux/slices/cartSlice";
import { fetchWishlist } from "../redux/slices/wishlistSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    Promise.all([
      dispatch(fetchCart({ token })),
      dispatch(fetchWishlist({ token })),
    ]);
  }, [dispatch, token]);

  useEffect(() => {
    if (token) {
      dispatch(fetchMe({ token }));
    }
  }, [dispatch, token]);

  const isLoggedIn = Boolean(token);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const navItems = [
    { label: "Home", icon: FaHome, path: "/" },
    { label: "Shop", icon: FaStore, path: "/shop" },
    { label: "Categories", icon: FaTags, path: "/categories" },
    { label: "Contact", icon: FaEnvelope, path: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mr-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <GiClothes className="text-xl text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              FashionStore
            </span>
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                >
                  <div className="p-1.5 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <FaUser className="text-sm text-blue-600" />
                  </div>
                  <span className="hidden sm:inline font-medium">
                    {user?.firstname || "Profile"}
                  </span>
                </button>

                {user?.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
                  >
                    <FaTachometerAlt className="text-sm" />
                    <span>Dashboard</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3 border-t border-gray-200">
          <nav className="flex items-center justify-around">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600 transition-all duration-200"
              >
                <item.icon className="text-lg" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
