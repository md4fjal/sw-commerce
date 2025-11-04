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
} from "react-icons/fa";
import Loader from "../../../components/loader";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { product, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProductById({ token, id }));
  }, [id, dispatch, token]);

  if (loading || !product) return <Loader />;

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 max-w-3xl mx-auto mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FaTag className="text-blue-600 text-sm" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Product Details
            </h1>
            <p className="text-sm text-gray-500">View product information</p>
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

      <div className="space-y-6">
        {/* Product Image */}
        {product.images && (
          <div className="flex justify-center">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <img
                src={product.images}
                alt={product.name}
                className="w-48 h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaTag className="text-blue-500 text-sm" />
            <div>
              <p className="text-sm text-gray-500">Product Name</p>
              <p className="font-semibold text-gray-900">{product.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaTag className="text-blue-500 text-sm" />
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold text-gray-900">
                {product.category?.name || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaDollarSign className="text-blue-500 text-sm" />
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-semibold text-gray-900">
                ₹{Number(product.price).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaBox className="text-blue-500 text-sm" />
            <div>
              <p className="text-sm text-gray-500">Stock</p>
              <p className="font-semibold text-gray-900">{product.stock}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FaCalendar className="text-blue-500 text-sm" />
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-semibold text-gray-900">
                {new Date(product.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-center pt-2">
          <Link
            to="/admin/products"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
