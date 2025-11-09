import {
  FaTimes,
  FaCalendar,
  FaImage,
  FaTag,
  FaLayerGroup,
} from "react-icons/fa";

const ViewCategoryModal = ({ category, onClose }) => {
  if (!category) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaTag className="text-blue-600 text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Category Details
              </h2>
              <p className="text-sm text-gray-500">View category information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500 text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Images */}
          <div className="grid grid-cols-3 gap-4">
            {category.image?.url && (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Image</p>
                <img
                  src={category.image.url}
                  alt={category.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300 mx-auto"
                />
              </div>
            )}
            {category.banner?.url && (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Banner</p>
                <img
                  src={category.banner.url}
                  alt={`${category.name} banner`}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300 mx-auto"
                />
              </div>
            )}
            {category.icon?.url && (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Icon</p>
                <img
                  src={category.icon.url}
                  alt={`${category.name} icon`}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300 mx-auto"
                />
              </div>
            )}
          </div>

          {/* Category Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaTag className="text-blue-500 text-sm" />
              <div>
                <p className="text-sm text-gray-500">Category Name</p>
                <p className="font-semibold text-gray-900">{category.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaLayerGroup className="text-blue-500 text-sm" />
              <div>
                <p className="text-sm text-gray-500">Parent Category</p>
                <p className="font-semibold text-gray-900">
                  {category.parent?.name || "No Parent"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaCalendar className="text-blue-500 text-sm" />
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-semibold text-gray-900">
                  {new Date(category.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaCalendar className="text-blue-500 text-sm" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-semibold text-gray-900">
                  {new Date(category.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-center pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCategoryModal;
