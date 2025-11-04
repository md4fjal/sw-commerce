import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  deleteOrder,
  updateOrderStatus,
  setPage,
  setSearch,
  setSort,
} from "../../../redux/slices/orderSlice";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import { FaSort, FaSortUp, FaSortDown, FaBox } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../../../components/admin/confirmDeleteModal";
import Loader from "../../../components/loader";
import ViewOrderModal from "../../../components/admin/orders/viewOrderModal";
import UpdateStatusModal from "../../../components/admin/orders/updateStatusModal";

// Import reusable components
import SearchBar from "../../../components/admin/SearchBar";
import Pagination from "../../../components/admin/Pagination";
import EntityActions from "../../../components/admin/EntityActions";

const DEBOUNCE_DELAY = 500;

const Orders = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [initialized, setInitialized] = useState(false);

  console.log("selectedOrder", selectedOrder);

  const { token } = useSelector((state) => state.auth);
  const {
    orders,
    loading,
    error,
    page,
    pages,
    search: searchFromStore,
    sortBy,
    order,
    total,
  } = useSelector((state) => state.order);

  const [localSearch, setLocalSearch] = useState(searchFromStore);
  const debouncedSearch = useDebounce(localSearch, DEBOUNCE_DELAY);

  // Initialize from URL
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlSortBy = searchParams.get("sortBy") || "createdAt";
    const urlOrder = searchParams.get("order") || "desc";
    const urlPage = Number(searchParams.get("page")) || 1;

    dispatch(setSearch(urlSearch));
    dispatch(setSort({ sortBy: urlSortBy, order: urlOrder }));
    dispatch(setPage(urlPage));
    setLocalSearch(urlSearch);
    setInitialized(true);
  }, []);

  // Update URL on state change
  useEffect(() => {
    if (!initialized) return;
    const params = {};
    if (searchFromStore) params.search = searchFromStore;
    if (page > 1) params.page = page;
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    setSearchParams(params);
  }, [searchFromStore, page, sortBy, order, initialized]);

  // Debounced search update
  useEffect(() => {
    if (debouncedSearch !== searchFromStore) {
      dispatch(setSearch(debouncedSearch));
      dispatch(setPage(1));
    }
  }, [debouncedSearch]);

  // Fetch Orders
  useEffect(() => {
    if (!initialized) return;
    dispatch(
      fetchOrders({ token, search: searchFromStore, sortBy, order, page })
    );
  }, [token, searchFromStore, sortBy, order, page, initialized]);

  const handleSort = (key) => {
    const newOrder = sortBy === key && order === "asc" ? "desc" : "asc";
    dispatch(setSort({ sortBy: key, order: newOrder }));
    toast.success(
      `Sorted by ${key} ${newOrder === "asc" ? "ascending" : "descending"}`
    );
  };

  const handlePageChange = (pageNum) => {
    dispatch(setPage(pageNum));
  };

  const handlePrevPage = () => {
    if (page > 1) dispatch(setPage(page - 1));
  };

  const handleNextPage = () => {
    if (page < pages) dispatch(setPage(page + 1));
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(setSearch(""));
    dispatch(setPage(1));
    setSearchParams({});
  };

  const confirmDelete = (id) => {
    setSelectedOrderId(id);
    setShowDelete(true);
  };

  const handleDelete = () => {
    dispatch(deleteOrder({ orderId: selectedOrderId, token }))
      .unwrap()
      .then(() => toast.success("Order deleted successfully"))
      .catch((err) => toast.error(err))
      .finally(() => {
        setShowDelete(false);
        setSelectedOrderId(null);
      });
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = (newStatus) => {
    dispatch(
      updateOrderStatus({
        orderId: selectedOrder._id,
        status: newStatus,
        token,
      })
    )
      .unwrap()
      .then(() => {
        toast.success(`Order status updated to ${newStatus}`);
        setShowStatusModal(false);
        setSelectedOrder(null);
      })
      .catch((err) => toast.error(err));
  };

  const getSortIcon = (key) => {
    if (sortBy !== key) return <FaSort className="text-gray-400" />;
    return order === "asc" ? (
      <FaSortUp className="text-purple-400" />
    ) : (
      <FaSortDown className="text-purple-400" />
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">View and manage all customer orders</p>
        </div>
      </div>

      {/* Search + Count */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            onClear={handleClearSearch}
            placeholder="Search orders by email, ID, or status..."
          />
        </div>

        <div className="flex items-center">
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-semibold text-purple-400">{total}</span>{" "}
              orders
            </span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      {!error && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th
                    onClick={() => handleSort("user.email")}
                    className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Customer</span>
                      {getSortIcon("user.email")}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("totalAmount")}
                    className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 text-center"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Total</span>
                      {getSortIcon("totalAmount")}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("orderStatus")}
                    className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Status</span>
                      {getSortIcon("orderStatus")}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("createdAt")}
                    className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Created</span>
                      {getSortIcon("createdAt")}
                    </div>
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-purple-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.user?.email}
                          </div>
                          {order.shippingInfo && (
                            <div className="text-xs text-gray-500">
                              {order.shippingInfo.city},{" "}
                              {order.shippingInfo.country}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-800">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <EntityActions
                          onView={() => handleView(order)}
                          onEdit={() => handleUpdateStatus(order)}
                          onDelete={() => confirmDelete(order._id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FaBox className="text-4xl mb-2 opacity-50" />
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm">Try adjusting your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <Pagination
          page={page}
          pages={pages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modals */}
      {showDelete && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          message="Are you sure you want to delete this order? This action cannot be undone."
        />
      )}

      {showViewModal && (
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showStatusModal && (
        <UpdateStatusModal
          order={selectedOrder}
          onClose={() => setShowStatusModal(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default Orders;
