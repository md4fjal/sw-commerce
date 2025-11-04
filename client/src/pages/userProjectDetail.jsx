import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

import { useParams, Link } from "react-router-dom";
import { FaHeart, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import Loader from "../components/loader";
import { getProductById } from "../redux/slices/productSlice";
import { addToWishlist, fetchWishlist } from "../redux/slices/wishlistSlice";

const UserProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { product, loading } = useSelector((state) => state.product);
  const { wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (id && token) {
      dispatch(getProductById({ token, id }));
      dispatch(fetchWishlist({ token }));
    }
  }, [id, token, dispatch]);

  if (loading || !product) return <Loader />;

  const isInWishlist = wishlist?.some((item) => item._id === product._id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist({ token, productId: product._id }));
    } else {
      dispatch(addToWishlist({ token, productId: product._id }));
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ token, productId: product._id, quantity: 1 }));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaArrowLeft /> <span>Back to Shop</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex justify-center items-center">
            <img
              src={product.images || "/placeholder.jpg"}
              alt={product.name}
              className="w-full max-w-md rounded-lg border border-gray-200 object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                Category:{" "}
                <span className="font-medium text-gray-800">
                  {product.category?.name || "Uncategorized"}
                </span>
              </p>

              <p className="text-xl font-semibold text-blue-600 mb-2">
                ${Number(product.price).toFixed(2)}
              </p>
              <p
                className={`mb-4 text-sm ${
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>

              {product.description && (
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              <p className="text-gray-500 text-xs">
                Added on{" "}
                {new Date(product.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaShoppingCart /> Add to Cart
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg border transition-colors ${
                  isInWishlist
                    ? "bg-red-100 text-red-600 border-red-200"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }`}
              >
                <FaHeart />
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProductDetail;
