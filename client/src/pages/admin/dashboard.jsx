import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  FaUsers,
  FaShoppingBag,
  FaClipboardList,
  FaChartLine,
  FaShoppingCart,
  FaPlus,
  FaEye,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { getAllUsers } from "../../redux/slices/userSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { fetchOrders, fetchOrderStats } from "../../redux/slices/orderSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { user, token } = useSelector((state) => state.auth);
  const { total: totalUsers } = useSelector((state) => state.user);
  const { total: totalProducts } = useSelector((state) => state.product);
  const { total: totalCategory } = useSelector((state) => state.category);
  const { total: totalOrders, stats } = useSelector((state) => state.order);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(getAllUsers({ token })),
          dispatch(fetchProducts({})),
          dispatch(fetchCategories({})),
          dispatch(fetchOrders({ token })),
          dispatch(fetchOrderStats({ token })),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, token]);

  const statsData = [
    {
      title: "Total Users",
      value: totalUsers || 0,
      icon: FaUsers,
      color: "blue",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Categories",
      value: totalCategory || 0,
      icon: FaShoppingBag,
      color: "green",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Products",
      value: totalProducts || 0,
      icon: FaShoppingCart,
      color: "purple",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: totalOrders || 0,
      icon: FaClipboardList,
      color: "orange",
      trend: stats?.orderGrowth
        ? `${stats.orderGrowth > 0 ? "+" : ""}${stats.orderGrowth}%`
        : "+0%",
      trendUp: stats?.orderGrowth > 0,
    },
  ];

  const quickActions = [
    {
      label: "Manage Users",
      icon: FaUsers,
      path: "/admin/users",
    },
    {
      label: "Add Product",
      icon: FaPlus,
      path: "/admin/products/add",
    },
    {
      label: "View Orders",
      icon: FaEye,
      path: "/admin/orders",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstname}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your store performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`text-${stat.color}-600 text-xl`} />
              </div>
              <div
                className={`flex items-center text-sm ${
                  stat.trendUp ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trendUp ? (
                  <FaArrowUp className="mr-1" />
                ) : (
                  <FaArrowDown className="mr-1" />
                )}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => (window.location.href = action.path)}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <action.icon className="text-purple-600 text-lg" />
              <span className="text-gray-700 font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Overview
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-lg font-bold text-gray-900">
                ${stats?.totalRevenue?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="text-lg font-bold text-green-600">
                ${stats?.currentMonthRevenue?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Growth</span>
              <span
                className={`text-sm font-medium ${
                  stats?.revenueGrowth > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats?.revenueGrowth > 0 ? "+" : ""}
                {stats?.revenueGrowth || 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Analytics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="text-lg font-bold text-gray-900">
                {stats?.conversionRate?.toFixed(1) || "0"}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Orders</span>
              <span className="text-lg font-bold text-gray-900">
                {stats?.currentMonthOrders || "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Growth</span>
              <span
                className={`text-sm font-medium ${
                  stats?.orderGrowth > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats?.orderGrowth > 0 ? "+" : ""}
                {stats?.orderGrowth || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
