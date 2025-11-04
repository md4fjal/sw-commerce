import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
  setPage,
  setSearch,
  setSort,
} from "../../../redux/slices/categorySlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
  FaBox,
  FaCalendar,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../../../components/admin/confirmDeleteModal";
import Loader from "../../../components/loader";
import ViewCategoryModal from "../../../components/admin/categories/viewCategoryModal.jsx";
import EditCategoryModal from "../../../components/admin/categories/editCategoryModal";
import AddCategoryModal from "../../../components/admin/categories/addCategoryModal";

// Import reusable components
import SearchBar from "../../../components/admin/SearchBar";
import Pagination from "../../../components/admin/Pagination";
import EntityActions from "../../../components/admin/EntityActions";

const DEBOUNCE_DELAY = 500;

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const {
    categories,
    loading,
    error,
    page,
    pages,
    search: searchFromStore,
    sortBy,
    order,
    total,
  } = useSelector((state) => state.category);

  const [localSearch, setLocalSearch] = useState(searchFromStore);
  const debouncedSearch = useDebounce(localSearch, DEBOUNCE_DELAY);

  // Initialize from URL once
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

  // Update URL when store changes
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

  // Fetch categories
  useEffect(() => {
    if (!initialized) return;
    dispatch(
      fetchCategories({
        search: searchFromStore,
        sortBy,
        order,
        page,
      })
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
    setSelectedCategoryId(id);
    setShowDelete(true);
  };

  const handleDelete = () => {
    dispatch(deleteCategory({ id: selectedCategoryId, token }))
      .unwrap()
      .then(() => toast.success("Category deleted successfully"))
      .catch((err) => toast.error(err))
      .finally(() => {
        setShowDelete(false);
        setSelectedCategoryId(null);
      });
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleEdit = (id) => {
    setSelectedCategory(id);
    setShowEditModal(true);
  };

  const handleAddCategory = () => {
    setShowAddModal(true);
  };

  const getSortIcon = (key) => {
    if (sortBy !== key) return <FaSort className="text-gray-400" />;
    return order === "asc" ? (
      <FaSortUp className="text-purple-400" />
    ) : (
      <FaSortDown className="text-purple-400" />
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Category Management
          </h1>
          <p className="text-gray-600">Manage, view, and edit all categories</p>
        </div>
        <button
          onClick={handleAddCategory}
          className="mt-4 sm:mt-0 flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-xl font-medium shadow-md transition-all duration-200"
        >
          <FaPlus />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search + Count */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            onClear={handleClearSearch}
            placeholder="Search categories..."
          />
        </div>

        <div className="flex items-center">
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-semibold text-purple-400">{total}</span>{" "}
              categories
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
                  <th
                    onClick={() => handleSort("name")}
                    className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Name</span>
                      {getSortIcon("name")}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("createdAt")}
                    className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Added Date</span>
                      {getSortIcon("createdAt")}
                    </div>
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <tr
                      key={category._id}
                      className="hover:bg-purple-50 transition-colors duration-200"
                    >
                      <td className="p-4 flex items-center space-x-3">
                        {category.image && (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                        )}
                        <span className="text-gray-800 font-medium">
                          {category.name}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center text-gray-600">
                        {new Date(category.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <EntityActions
                          onView={() => handleView(category)}
                          onEdit={() => handleEdit(category._id)}
                          onDelete={() => confirmDelete(category._id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FaBox className="text-4xl mb-2 opacity-50" />
                        <p className="text-lg font-medium">
                          No categories found
                        </p>
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
          message="Are you sure you want to delete this category? This action cannot be undone."
        />
      )}
      {showAddModal && (
        <AddCategoryModal onClose={() => setShowAddModal(false)} />
      )}

      {showEditModal && (
        <EditCategoryModal
          id={selectedCategory}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showViewModal && (
        <ViewCategoryModal
          category={selectedCategory}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default Categories;
