import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../../redux/slices/productSlice";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaTag,
  FaDollarSign,
  FaBox,
  FaCalendar,
  FaImage,
  FaStar,
  FaWeight,
  FaRuler,
  FaVenusMars,
  FaUndo,
  FaPalette,
  FaRulerVertical,
  FaHashtag,
  FaShieldVirus,
} from "react-icons/fa";
import Loader from "../../../components/loader";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { product, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProductById({ id }));
  }, [id, dispatch]);

  if (loading || !product) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 rounded-xl">
            <FaTag className="text-blue-600 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Product Details
            </h1>
            <p className="text-gray-600">Complete product information</p>
          </div>
        </div>
        <Link
          to="/admin/products"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors"
        >
          <FaArrowLeft className="text-sm" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="space-y-8">
        {product.images && product.images.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FaImage className="text-yellow-500" />
              <span>Product Images</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={image.alt || product.name}
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  {image.alt && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg">
                      {image.alt}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FaTag className="text-blue-500" />
            <span>Basic Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <FaTag className="text-blue-500 text-sm" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Product Name</p>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <FaTag className="text-blue-500 text-sm" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="font-semibold text-gray-900">{product.brand}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <FaTag className="text-blue-500 text-sm" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold text-gray-900">
                    {product.category?.name || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <FaHashtag className="text-blue-500 text-sm" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">SKU</p>
                  <p className="font-semibold text-gray-900">
                    {product.sku || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <FaVenusMars className="text-blue-500 text-sm" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {product.gender || "unisex"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <FaWeight className="text-blue-500 text-sm" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-semibold text-gray-900">
                    {product.weight ? `${product.weight} kg` : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <FaStar className="text-blue-500 text-sm" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Rating & Reviews</p>
                  <p className="font-semibold text-gray-900">
                    {product.rating || 0} ⭐ ({product.numReviews || 0} reviews)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <FaTag className="text-blue-500 text-sm" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Status</p>
                  <p
                    className={`font-semibold ${
                      product.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.status
                      ? product.status.charAt(0).toUpperCase() +
                        product.status.slice(1)
                      : "Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FaDollarSign className="text-green-500" />
            <span>Pricing & Inventory</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <FaDollarSign className="text-green-500 text-sm" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold text-gray-900">
                  ₹{Number(product.price).toFixed(2)}
                </p>
              </div>
            </div>

            {product.salePrice && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <FaDollarSign className="text-red-500 text-sm" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Sale Price</p>
                  <p className="font-semibold text-red-600">
                    ₹{Number(product.salePrice).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <FaBox className="text-blue-500 text-sm" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Stock</p>
                <p
                  className={`font-semibold ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {(product.dimensions?.length ||
          product.dimensions?.width ||
          product.dimensions?.height) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FaRuler className="text-purple-500" />
              <span>Dimensions (cm)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.dimensions?.length && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <FaRulerVertical className="text-purple-500 text-sm" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Length</p>
                    <p className="font-semibold text-gray-900">
                      {product.dimensions.length} cm
                    </p>
                  </div>
                </div>
              )}

              {product.dimensions?.width && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <FaRulerVertical className="text-purple-500 text-sm" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Width</p>
                    <p className="font-semibold text-gray-900">
                      {product.dimensions.width} cm
                    </p>
                  </div>
                </div>
              )}

              {product.dimensions?.height && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <FaRulerVertical className="text-purple-500 text-sm" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-semibold text-gray-900">
                      {product.dimensions.height} cm
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Attributes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <FaPalette className="text-blue-500 text-sm" />
                <span>Colors</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors && product.colors.length > 0 ? (
                  product.colors.map((color, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {color}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No colors specified</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <FaRuler className="text-green-500 text-sm" />
                <span>Sizes</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((size, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {size}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No sizes specified</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <FaHashtag className="text-purple-500 text-sm" />
                <span>Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags && product.tags.length > 0 ? (
                  product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No tags specified</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Settings & Policies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">
                Product Flags
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">
                    Featured Product
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.isFeatured
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isFeatured ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">New Arrival</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.isNewArrival
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isNewArrival ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Trending</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.isTrending
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isTrending ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Policies</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaUndo className="text-blue-500 text-sm" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Return Policy</p>
                    <p className="font-semibold text-gray-900">
                      {product.returnPolicyDays || 7} days
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaShieldVirus className="text-green-500 text-sm" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Warranty</p>
                    <p className="font-semibold text-gray-900">
                      {product.warranty || "No Warranty"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FaCalendar className="text-blue-500" />
            <span>Timestamps</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <FaCalendar className="text-blue-500 text-sm" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-semibold text-gray-900">
                  {new Date(product.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <FaCalendar className="text-blue-500 text-sm" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Updated At</p>
                <p className="font-semibold text-gray-900">
                  {new Date(product.updatedAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 pt-6">
          <Link
            to="/admin/products"
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Products
          </Link>
          <Link
            to={`/admin/products/${product._id}/edit`}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Edit Product
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
