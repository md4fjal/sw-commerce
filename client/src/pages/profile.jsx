import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchMe, logout } from "../redux/slices/authSlice";
import { updateProfile } from "../redux/slices/userSlice";
import {
  fetchAddress,
  updateBillingAddress,
  updateShippingAddress,
} from "../redux/slices/addressSlice";
import {
  FaShoppingBag,
  FaSignOutAlt,
  FaEdit,
  FaHistory,
  FaLock,
  FaSave,
  FaTimes,
  FaUser,
  FaMapMarkerAlt,
  FaHome,
  FaTruck,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchCart } from "../redux/slices/cartSlice";
import { fetchWishlist } from "../redux/slices/wishlistSlice";
import { getMyOrders } from "../redux/slices/paymentSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.user);
  const { billingAddress, shippingAddress } = useSelector(
    (state) => state.address
  );
  const { totalOrders } = useSelector((state) => state.payment);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (token) {
      Promise.all([
        dispatch(fetchMe({ token })),
        dispatch(fetchCart({ token })),
        dispatch(fetchWishlist({ token })),
        dispatch(getMyOrders({ token })),
        dispatch(fetchAddress({ token })),
      ]);
    }
  }, [dispatch, token]);

  const [editMode, setEditMode] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
  });

  const [billingData, setBillingData] = useState({});
  const [shippingData, setShippingData] = useState({});

  useEffect(() => {
    setBillingData(billingAddress || {});
    setShippingData(shippingAddress || {});
  }, [billingAddress, shippingAddress]);

  useEffect(() => {
    setFormData({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
    });
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBillingChange = (e) =>
    setBillingData({ ...billingData, [e.target.name]: e.target.value });

  const handleShippingChange = (e) =>
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async () => {
    const res = await dispatch(updateProfile({ data: formData, token }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } else toast.error(res.payload || "Failed to update profile");
  };

  const handleSaveAddress = async () => {
    const r1 = await dispatch(
      updateBillingAddress({ data: billingData, token })
    );
    const r2 = await dispatch(
      updateShippingAddress({ data: shippingData, token })
    );

    if (
      r1.meta.requestStatus === "fulfilled" &&
      r2.meta.requestStatus === "fulfilled"
    ) {
      toast.success("Address updated successfully!");
      setEditAddress(false);
      dispatch(fetchAddress({ token }));
    } else {
      toast.error("Failed to update address");
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: FaShoppingBag,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      href: "/my-orders",
    },
    {
      label: "Wishlist Items",
      value: wishlist?.length || "0",
      icon: FaHistory,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      href: "/wishlist",
    },
    {
      label: "Cart Items",
      value: cart?.length || "0",
      icon: FaShoppingBag,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      href: "/cart",
    },
  ];

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "address", label: "Address", icon: FaMapMarkerAlt },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4 mx-auto">
              {user?.firstname?.[0]?.toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstname}!
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your profile and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              {/* Stats */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  Your Stats
                </h3>
                <div className="space-y-3">
                  {stats.map((s, i) => (
                    <Link
                      key={i}
                      to={s.href}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md ${
                        s.bgColor
                      } border border-transparent hover:border-${
                        s.color.split("-")[1]
                      }-200`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${s.color} shadow-md`}>
                          <s.icon className="text-white text-base" />
                        </div>
                        <span className="font-medium text-gray-700">
                          {s.label}
                        </span>
                      </div>
                      <span className={`text-xl font-bold ${s.textColor}`}>
                        {s.value}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaLock className="text-blue-600" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/change-password")}
                    className="w-full flex items-center gap-3 p-4 text-blue-700 bg-blue-50 border border-blue-200 rounded-xl transition-all duration-200 hover:bg-blue-100 hover:shadow-md hover:scale-105"
                  >
                    <FaLock className="text-blue-600" />
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-4 text-red-700 bg-red-50 border border-red-200 rounded-xl transition-all duration-200 hover:bg-red-100 hover:shadow-md hover:scale-105"
                  >
                    <FaSignOutAlt className="text-red-600" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <div className="flex space-x-1 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 font-medium rounded-t-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <tab.icon className="text-sm" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Profile Information
                      </h2>
                      {!editMode && (
                        <button
                          onClick={() => setEditMode(true)}
                          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        >
                          <FaEdit />
                          Edit Profile
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {["firstname", "lastname", "email"].map((field) => (
                        <div key={field} className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                            {field}
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              name={field}
                              value={formData[field]}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder={`Enter your ${field}`}
                            />
                          ) : (
                            <p className="text-gray-900 font-medium text-lg px-1">
                              {user?.[field]}
                            </p>
                          )}
                        </div>
                      ))}

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                          Role
                        </label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 ml-2">
                          {user?.role}
                        </span>
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={handleUpdateProfile}
                          disabled={loading}
                          className="flex items-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                        >
                          <FaSave />
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setFormData({
                              firstname: user?.firstname || "",
                              lastname: user?.lastname || "",
                              email: user?.email || "",
                            });
                          }}
                          className="flex items-center gap-2 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <FaTimes />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Address Tab */}
                {activeTab === "address" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Address Information
                      </h2>
                      {!editAddress && (
                        <button
                          onClick={() => setEditAddress(true)}
                          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        >
                          <FaEdit />
                          Edit Address
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Billing Address */}
                      <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <FaHome className="text-blue-600 text-lg" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Billing Address
                          </h3>
                        </div>

                        {editAddress ? (
                          <div className="space-y-4">
                            {[
                              "streetAddress",
                              "city",
                              "state",
                              "pinCode",
                              "phone",
                            ].map((field) => (
                              <input
                                key={field}
                                name={field}
                                value={billingData?.[field] || ""}
                                onChange={handleBillingChange}
                                placeholder={field
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2 text-gray-700">
                            <p className="font-semibold">
                              {billingAddress?.streetAddress}
                            </p>
                            <p>
                              {billingAddress?.city}, {billingAddress?.state}
                            </p>
                            <p>PIN: {billingAddress?.pinCode}</p>
                            <p>Phone: {billingAddress?.phone}</p>
                          </div>
                        )}
                      </div>

                      {/* Shipping Address */}
                      <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <FaTruck className="text-green-600 text-lg" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Shipping Address
                          </h3>
                        </div>

                        {editAddress ? (
                          <div className="space-y-4">
                            {[
                              "streetAddress",
                              "city",
                              "state",
                              "pinCode",
                              "phone",
                            ].map((field) => (
                              <input
                                key={field}
                                name={field}
                                value={shippingData?.[field] || ""}
                                onChange={handleShippingChange}
                                placeholder={field
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2 text-gray-700">
                            <p className="font-semibold">
                              {shippingAddress?.streetAddress}
                            </p>
                            <p>
                              {shippingAddress?.city}, {shippingAddress?.state}
                            </p>
                            <p>PIN: {shippingAddress?.pinCode}</p>
                            <p>Phone: {shippingAddress?.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {editAddress && (
                      <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <button
                          onClick={handleSaveAddress}
                          className="flex items-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <FaSave />
                          Save Address
                        </button>
                        <button
                          onClick={() => {
                            setEditAddress(false);
                            setBillingData(billingAddress || {});
                            setShippingData(shippingAddress || {});
                          }}
                          className="flex items-center gap-2 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <FaTimes />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
