import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductById,
  updateProduct,
} from "../../../redux/slices/productSlice";
import { fetchCategories } from "../../../redux/slices/categorySlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaEdit,
  FaSave,
  FaTag,
  FaDollarSign,
  FaBox,
  FaImage,
  FaArrowLeft,
} from "react-icons/fa";
import Loader from "../../../components/loader";

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { product, loading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    images: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(getProductById({ token, id }));
    dispatch(fetchCategories({}));
  }, [id, dispatch, token]);

  useEffect(() => {
    if (product)
      setFormData({
        name: product.name || "",
        category: product.category?._id || "",
        price: product.price || "",
        stock: product.stock || "",
        images: product.images || "",
      });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await dispatch(updateProduct({ token, id, data: formData })).unwrap();
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !formData.name) return <Loader />;

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 max-w-2xl mx-auto mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FaEdit className="text-blue-600 text-sm" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Edit Product
            </h1>
            <p className="text-sm text-gray-500">Update product details</p>
          </div>
        </div>
        <Link
          to="/admin/products"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <FaArrowLeft className="text-sm" />
          <span>Back</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <FaTag className="text-gray-400 text-sm" />
            <span>Product Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <FaTag className="text-gray-400 text-sm" />
            <span>Category</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <FaDollarSign className="text-gray-400 text-sm" />
              <span>Price</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <FaBox className="text-gray-400 text-sm" />
              <span>Stock</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <FaImage className="text-gray-400 text-sm" />
            <span>Image URL</span>
          </label>
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Preview */}
        {formData.images && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Preview:</p>
            <img
              src={formData.images}
              alt="Preview"
              className="w-16 h-16 object-cover rounded border border-gray-300"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {updating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaSave className="text-sm" />
            )}
            <span>{updating ? "Updating..." : "Update Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
