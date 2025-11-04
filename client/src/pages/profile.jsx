import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchMe, logout } from "../redux/slices/authSlice";
import { updateProfile } from "../redux/slices/userSlice";
import {
  FaShoppingBag,
  FaSignOutAlt,
  FaEdit,
  FaHistory,
  FaLock,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchCart } from "../redux/slices/cartSlice";
import { fetchWishlist } from "../redux/slices/wishlistSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.user);

  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    Promise.all([
      dispatch(fetchCart({ token })),
      dispatch(fetchWishlist({ token })),
    ]);
  }, [dispatch, token]);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (token) dispatch(fetchMe({ token }));
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await dispatch(updateProfile({ data: formData, token }));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Profile updated successfully!");
        dispatch(fetchMe({ token }));
        setEditMode(false);
      } else {
        toast.error(res.payload || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const stats = [
    { label: "Orders", value: "12", icon: FaShoppingBag, color: "bg-blue-500" },
    {
      label: "Wishlist",
      value: wishlist?.length || "0",
      icon: FaHistory,
      color: "bg-purple-500",
      href: "/wishlist",
    },
    {
      label: "Cart Items",
      value: cart?.length || "0",
      icon: FaShoppingBag,
      color: "bg-green-500",
      href: "/cart",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstname}!
          </h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  {user?.firstname?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {user?.firstname} {user?.lastname}
                  </h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {["firstname", "lastname", "email"].map((field) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {field === "firstname"
                        ? "First Name"
                        : field === "lastname"
                        ? "Last Name"
                        : "Email"}
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium mt-1">
                        {user?.[field]}
                      </p>
                    )}
                  </div>
                ))}
                {/* Role */}
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Role
                  </label>
                  <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {editMode ? (
                  <>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaSave />
                      <span>{loading ? "Saving..." : "Save Changes"}</span>
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/shop")}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaShoppingBag />
                      <span>Continue Shopping</span>
                    </button>
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEdit />
                      <span>Edit Profile</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Your Stats
              </h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <Link
                    key={index}
                    to={stat.href}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${stat.color}`}>
                        <stat.icon className="text-white text-sm" />
                      </div>
                      <span className="font-medium text-gray-700">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {stat.value}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/change-password")}
                  className="w-full flex items-center gap-3 p-3 text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium border border-blue-200"
                >
                  <FaLock />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded transition-colors font-medium border border-red-200"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
