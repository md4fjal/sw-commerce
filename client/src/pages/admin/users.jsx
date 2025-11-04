import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  deleteUser,
  toggleRole,
  setPage,
  setSearch,
  setSort,
} from "../../redux/slices/userSlice";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import toast from "react-hot-toast";

import Loader from "../../components/loader";
import ConfirmDeleteModal from "../../components/admin/confirmDeleteModal";
import UserDetailModal from "../../components/admin/userDetailModal";
import DataTable from "../../components/admin/DataTable";
import SearchBar from "../../components/admin/SearchBar";
import Pagination from "../../components/admin/Pagination";
import EntityActions from "../../components/admin/EntityActions";

import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

const DEBOUNCE_DELAY = 500;

const Users = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showDelete, setShowDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const { users, loading, error, page, pages, search, sortBy, order, total } =
    useSelector((state) => state.user);

  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, DEBOUNCE_DELAY);

  // 1️⃣ Load from URL → Redux on initial mount
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlSortBy = searchParams.get("sortBy") || "createdAt";
    const urlOrder = searchParams.get("order") || "desc";
    const urlPage = Number(searchParams.get("page")) || 1;

    if (urlSearch !== search) dispatch(setSearch(urlSearch));
    if (urlSortBy !== sortBy || urlOrder !== order)
      dispatch(setSort({ sortBy: urlSortBy, order: urlOrder }));
    if (urlPage !== page) dispatch(setPage(urlPage));

    setLocalSearch(urlSearch);
  }, []);

  // 2️⃣ Keep URL in sync with Redux state
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (page && page > 1) params.page = page;
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;

    setSearchParams(params);
  }, [search, page, sortBy, order, setSearchParams]);

  // 3️⃣ Update Redux search when debounced input changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      dispatch(setSearch(debouncedSearch));
      dispatch(setPage(1));
    }
  }, [debouncedSearch, dispatch, search]);

  // 4️⃣ Fetch users on dependency changes
  useEffect(() => {
    dispatch(getAllUsers({ token, search, sortBy, order, page }));
  }, [dispatch, token, search, sortBy, order, page]);

  // --- Sorting Logic ---
  const handleSort = (key) => {
    const newOrder = sortBy === key && order === "asc" ? "desc" : "asc";
    dispatch(setSort({ sortBy: key, order: newOrder }));
    toast.success(`Sorted by ${key} ${newOrder}`);
  };

  // --- Toggle Role ---
  const handleToggleRole = (userId) => {
    dispatch(toggleRole({ id: userId, token }))
      .unwrap()
      .then(() => toast.success("User role updated successfully"))
      .catch((err) => toast.error(err));
  };

  // --- Delete ---
  const handleDelete = () => {
    dispatch(deleteUser({ id: selectedUserId, token }))
      .unwrap()
      .then(() => toast.success("User deleted successfully"))
      .catch((err) => toast.error(err))
      .finally(() => {
        setShowDelete(false);
        setSelectedUserId(null);
      });
  };

  // --- Sort Icon Helper ---
  const getSortIcon = (key) => {
    if (sortBy !== key) return <FaSort className="text-gray-400" />;
    return order === "asc" ? (
      <FaSortUp className="text-purple-400" />
    ) : (
      <FaSortDown className="text-purple-400" />
    );
  };

  // --- Table Columns ---
  const columns = [
    { key: "firstname", label: "First Name" },
    { key: "lastname", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "createdAt", label: "Joined Date" },
  ];

  // --- User Rows ---
  const userRows = useMemo(() => {
    if (!users || users.length === 0)
      return (
        <tr>
          <td colSpan={6} className="p-8 text-center text-gray-500">
            <FaUser className="text-4xl mx-auto opacity-50 mb-2" />
            No users found
          </td>
        </tr>
      );

    return users.map((user) => (
      <tr
        key={user._id}
        className="border-t border-gray-100 hover:bg-purple-50 transition-all"
      >
        <td className="p-4 font-medium">{user.firstname}</td>
        <td className="p-4">{user.lastname}</td>
        <td className="p-4 text-blue-600">
          <a
            href={`mailto:${user.email}`}
            className="hover:underline flex items-center gap-1"
          >
            <FaEnvelope className="text-sm" /> {user.email}
          </a>
        </td>
        <td className="p-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {user.role}
          </span>
        </td>
        <td className="p-4 text-gray-600 flex items-center gap-1">
          <FaCalendar className="text-gray-400" />
          {new Date(user.createdAt).toLocaleDateString()}
        </td>
        <td className="p-4">
          <EntityActions
            onView={() => setViewUser(user)}
            onToggleRole={() => handleToggleRole(user._id)}
            onDelete={() => {
              setSelectedUserId(user._id);
              setShowDelete(true);
            }}
          />
        </td>
      </tr>
    ));
  }, [users, token, dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>

      {/* 🔍 Search and Stats */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <SearchBar
          value={localSearch}
          onChange={setLocalSearch}
          onClear={() => {
            setLocalSearch("");
            dispatch(setSearch(""));
            dispatch(setPage(1));
            setSearchParams({});
          }}
          placeholder="Search users by name or email..."
        />
        <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
          Total: <span className="font-semibold text-purple-400">{total}</span>{" "}
          users
        </div>
      </div>

      {/* ⚠️ Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* 📋 Data Table */}
      <DataTable
        columns={columns.map((col) => ({
          ...col,
          icon: getSortIcon(col.key),
        }))}
        rows={userRows}
        sortBy={sortBy}
        order={order}
        onSort={handleSort}
      />

      {/* 🔄 Pagination */}
      <Pagination
        page={page}
        pages={pages}
        onPrev={() => {
          if (page > 1) dispatch(setPage(page - 1));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNext={() => {
          if (page < pages) dispatch(setPage(page + 1));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onPageChange={(num) => {
          dispatch(setPage(num));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* 🗑️ Modals */}
      {showDelete && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          message="Are you sure you want to delete this user? This action cannot be undone."
        />
      )}

      {viewUser && (
        <UserDetailModal user={viewUser} onClose={() => setViewUser(null)} />
      )}
    </div>
  );
};

export default Users;
