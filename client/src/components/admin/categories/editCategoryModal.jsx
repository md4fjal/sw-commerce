import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCategory,
  getCategoryById,
  fetchCategories,
} from "../../../redux/slices/categorySlice";
import toast from "react-hot-toast";
import Loader from "../../loader";
import { FaTimes, FaSave, FaUpload, FaImage } from "react-icons/fa";

const EditCategoryModal = ({ id, onClose }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { category, categoryLoading, categories } = useSelector(
    (state) => state.category
  );

  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [icon, setIcon] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [iconPreview, setIconPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) dispatch(getCategoryById({ id }));
  }, [id]);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setParent(category.parent?._id || "");
      setImagePreview(category.image?.url || "");
      setBannerPreview(category.banner?.url || "");
      setIconPreview(category.icon?.url || "");
    }
  }, [category]);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "image") {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
      if (type === "banner") {
        setBanner(file);
        setBannerPreview(URL.createObjectURL(file));
      }
      if (type === "icon") {
        setIcon(file);
        setIconPreview(URL.createObjectURL(file));
      }
    }
  };

  const removeImage = (type) => {
    if (type === "image") {
      setImage(null);
      setImagePreview(category?.image?.url || "");
    }
    if (type === "banner") {
      setBanner(null);
      setBannerPreview(category?.banner?.url || "");
    }
    if (type === "icon") {
      setIcon(null);
      setIconPreview(category?.icon?.url || "");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    const formData = new FormData();
    formData.append("name", name);
    if (parent) formData.append("parent", parent);
    if (image) formData.append("image", image);
    if (banner) formData.append("banner", banner);
    if (icon) formData.append("icon", icon);

    setLoading(true);
    dispatch(updateCategory({ id, token, formData }))
      .unwrap()
      .then(() => {
        toast.success("Category updated successfully");
        dispatch(fetchCategories({})); // Refresh the list
        onClose();
      })
      .catch((err) => toast.error(err))
      .finally(() => setLoading(false));
  };

  if (categoryLoading) return <Loader />;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaSave className="text-blue-600 text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Category
              </h2>
              <p className="text-sm text-gray-500">Update category details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500 text-sm" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* Parent Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Parent Category
            </label>
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">No Parent</option>
              {categories
                .filter((cat) => cat._id !== id) // Prevent selecting self as parent
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "image")}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <FaUpload className="text-gray-400 text-xl" />
                <span className="text-sm text-gray-500">
                  Click to upload new image
                </span>
              </label>
            </div>
            {imagePreview && (
              <div className="relative mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage("image")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* Banner Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Banner Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "banner")}
                className="hidden"
                id="banner-upload"
              />
              <label
                htmlFor="banner-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <FaUpload className="text-gray-400 text-xl" />
                <span className="text-sm text-gray-500">
                  Click to upload new banner
                </span>
              </label>
            </div>
            {bannerPreview && (
              <div className="relative mt-2">
                <img
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="w-full h-24 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage("banner")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* Icon Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Icon</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "icon")}
                className="hidden"
                id="icon-upload"
              />
              <label
                htmlFor="icon-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <FaUpload className="text-gray-400 text-xl" />
                <span className="text-sm text-gray-500">
                  Click to upload new icon
                </span>
              </label>
            </div>
            {iconPreview && (
              <div className="relative inline-block mt-2">
                <img
                  src={iconPreview}
                  alt="Icon Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage("icon")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaSave className="text-sm" />
              )}
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
