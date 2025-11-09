import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  setPage,
  setSearch,
  setSort,
} from "../../../redux/slices/productSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaTrash,
  FaPlus,
  FaEdit,
  FaBox,
  FaDollarSign,
  FaWarehouse,
  FaCalendar,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../../../components/admin/confirmDeleteModal";
import Loader from "../../../components/loader";

// Import reusable components
import SearchBar from "../../../components/admin/SearchBar";
import Pagination from "../../../components/admin/Pagination";

const DEBOUNCE_DELAY = 500;

// Enhanced EntityActions with Edit functionality
const EntityActions = ({ onView, onEdit, onDelete }) => (
  <div className="flex space-x-3 justify-center">
    {onView && (
      <button
        onClick={onView}
        className="text-blue-500 hover:text-blue-600 transition-colors"
        title="View"
      >
        <FaEye />
      </button>
    )}
    {onEdit && (
      <button
        onClick={onEdit}
        className="text-green-500 hover:text-green-600 transition-colors"
        title="Edit"
      >
        <FaEdit />
      </button>
    )}
    {onDelete && (
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-600 transition-colors"
        title="Delete"
      >
        <FaTrash />
      </button>
    )}
  </div>
);

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showDelete, setShowDelete] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const {
    products,
    loading,
    error,
    page,
    pages,
    search: searchFromStore,
    sortBy,
    order,
    total,
  } = useSelector((state) => state.product);

  const [localSearch, setLocalSearch] = useState(searchFromStore);
  const debouncedSearch = useDebounce(localSearch, DEBOUNCE_DELAY);

  // Initialize params from URL
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlSortBy = searchParams.get("sortBy") || "createdAt";
    const urlOrder = searchParams.get("order") || "desc";
    const urlPage = Number(searchParams.get("page")) || 1;

    if (urlSearch !== searchFromStore) dispatch(setSearch(urlSearch));
    if (urlSortBy !== sortBy || urlOrder !== order)
      dispatch(setSort({ sortBy: urlSortBy, order: urlOrder }));
    if (urlPage !== page) dispatch(setPage(urlPage));

    setLocalSearch(urlSearch);
  }, []);

  // Update URL params on state change
  useEffect(() => {
    const params = {};
    if (searchFromStore) params.search = searchFromStore;
    if (page && page > 1) params.page = page;
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    setSearchParams(params);
  }, [searchFromStore, page, sortBy, order, setSearchParams]);

  // Debounced search update
  useEffect(() => {
    if (debouncedSearch !== searchFromStore) {
      dispatch(setSearch(debouncedSearch));
      dispatch(setPage(1));
    }
  }, [debouncedSearch, dispatch, searchFromStore]);

  // Fetch products
  useEffect(() => {
    dispatch(
      fetchProducts({
        search: searchFromStore,
        sortBy,
        order,
        page,
      })
    );
  }, [dispatch, token, searchFromStore, sortBy, order, page]);

  // Sorting logic
  const handleSort = (key) => {
    const newOrder = sortBy === key && order === "asc" ? "desc" : "asc";
    dispatch(setSort({ sortBy: key, order: newOrder }));
    toast.success(
      `Sorted by ${key} ${newOrder === "asc" ? "ascending" : "descending"}`
    );
  };

  const handlePageChange = (pageNum) => {
    dispatch(setPage(pageNum));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pages) {
      handlePageChange(page + 1);
    }
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(setSearch(""));
    dispatch(setPage(1));
    setSearchParams({});
  };

  const confirmDelete = (id) => {
    setSelectedProductId(id);
    setShowDelete(true);
  };

  const handleDelete = () => {
    dispatch(deleteProduct({ id: selectedProductId, token }))
      .unwrap()
      .then(() => toast.success("Product deleted successfully"))
      .catch((err) => toast.error(err))
      .finally(() => {
        setShowDelete(false);
        setSelectedProductId(null);
      });
  };

  const handleView = (product) => navigate(`/admin/products/${product._id}`);
  const handleEdit = (id) => navigate(`/admin/products/${id}/edit`);
  const handleAddProduct = () => navigate(`/admin/products/add`);

  const getSortIcon = (key) => {
    if (sortBy !== key) return <FaSort className="text-gray-400" />;
    return order === "asc" ? (
      <FaSortUp className="text-purple-400" />
    ) : (
      <FaSortDown className="text-purple-400" />
    );
  };

  const productRows = useMemo(() => {
    if (!products || products.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="p-8 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <FaBox className="text-4xl mb-2 opacity-50" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </td>
        </tr>
      );
    }

    return products.map((product) => (
      <tr
        key={product._id}
        className="hover:bg-purple-50 transition-colors duration-200"
      >
        <td className="px-6 py-4 flex items-center space-x-3">
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
            />
          )}
          <div>
            <span className="font-medium text-gray-900 block">
              {product.name}
            </span>
            <span className="text-sm text-gray-500">{product.brand}</span>
          </div>
        </td>

        <td className="px-6 py-4 text-gray-700">
          {product.category?.name || "—"}
        </td>

        <td className="px-6 py-4 text-right text-gray-700">
          {product.salePrice ? (
            <div className="flex flex-col items-end">
              <span className="text-red-600 font-semibold">
                ₹{Number(product.salePrice).toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{Number(product.price).toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="font-semibold">
              ₹{Number(product.price).toFixed(2)}
            </span>
          )}
        </td>

        <td className="px-6 py-4 text-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.stock > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock || 0}
          </span>
        </td>

        <td className="px-6 py-4 text-center text-gray-600">
          {new Date(product.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </td>

        <td className="px-6 py-4 text-center">
          <EntityActions
            onView={() => handleView(product)}
            onEdit={() => handleEdit(product._id)}
            onDelete={() => confirmDelete(product._id)}
          />
        </td>
      </tr>
    ));
  }, [products]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Management
          </h1>
          <p className="text-gray-600">
            Manage, view, and edit all products in your store
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-4 sm:mt-0 flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-xl font-medium shadow-md transition-all duration-200"
        >
          <FaPlus />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            onClear={handleClearSearch}
            placeholder="Search products by name or category..."
          />
        </div>
        <div className="flex items-center">
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-semibold text-purple-400">{total}</span>{" "}
              products
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

      {/* Table - Keeping original table structure but using EntityActions */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left">
                  <th
                    onClick={() => handleSort("name")}
                    className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-all group"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Name</span>
                      {getSortIcon("name")}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("category")}
                    className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-all group"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Category</span>
                      {getSortIcon("category")}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("price")}
                    className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-right cursor-pointer hover:bg-gray-100 transition-all group"
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <span>Price</span>
                      {getSortIcon("price")}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("stock")}
                    className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-100 transition-all group"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Stock</span>
                      {getSortIcon("stock")}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("createdAt")}
                    className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-100 transition-all group"
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

              <tbody className="divide-y divide-gray-100">{productRows}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && pages > 1 && (
        <Pagination
          page={page}
          pages={pages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Modal */}
      {showDelete && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          message="Are you sure you want to delete this product? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default Products;
