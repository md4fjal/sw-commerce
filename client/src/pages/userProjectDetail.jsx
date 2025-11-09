import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaCreditCard,
  FaStar,
  FaTag,
  FaTruck,
  FaShieldAlt,
  FaExchangeAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import Loader from "../components/loader";
import { getProductBySlug } from "../redux/slices/productSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../redux/slices/wishlistSlice";

const UserProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { product, loading } = useSelector((state) => state.product);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug && token) {
      dispatch(getProductBySlug({ slug }));
      dispatch(fetchWishlist({ token }));
    }
  }, [slug, token, dispatch]);

  if (loading || !product) return <Loader />;

  const isInWishlist = wishlist?.some((item) => item._id === product._id);

  const handleWishlistToggle = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist({ token, productId: product._id }));
    } else {
      dispatch(addToWishlist({ token, productId: product._id }));
    }
  };

  const handleAddToCart = () => {
    if (!token) {
      // Handle login redirect
      return;
    }

    const cartItem = {
      productId: product._id,
      quantity,
      ...(selectedColor && { color: selectedColor }),
      ...(selectedSize && { size: selectedSize }),
    };

    dispatch(addToCart({ token, ...cartItem }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to cart page
  };

  const getDisplayPrice = () => {
    if (product.salePrice && product.salePrice < product.price) {
      return (
        <div className="flex items-center gap-3 mb-2">
          <p className="text-3xl font-bold text-green-600">
            ₹{product.salePrice.toLocaleString()}
          </p>
          <p className="text-xl text-gray-500 line-through">
            ₹{product.price.toLocaleString()}
          </p>
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
            Save ₹{(product.price - product.salePrice).toLocaleString()}
          </span>
        </div>
      );
    }
    return (
      <p className="text-3xl font-bold text-blue-600 mb-2">
        ₹{product.price.toLocaleString()}
      </p>
    );
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { text: "Out of Stock", color: "text-red-600", bg: "bg-red-100" };
    } else if (product.stock < 10) {
      return {
        text: `Only ${product.stock} left`,
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    } else {
      return { text: "In Stock", color: "text-green-600", bg: "bg-green-100" };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/category/${product.category?.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={
                    product.images?.[selectedImage]?.url || "/placeholder.jpg"
                  }
                  alt={product.images?.[selectedImage]?.alt || product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.public_id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                        selectedImage === index
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  {product.rating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            size={16}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.numReviews} reviews)
                      </span>
                    </div>
                  )}

                  {/* Brand */}
                  <p className="text-lg text-gray-700 mb-2">
                    Brand:{" "}
                    <span className="font-semibold">{product.brand}</span>
                  </p>
                </div>

                {/* Price */}
                {getDisplayPrice()}

                {/* Stock Status */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${stockStatus.bg}`}
                >
                  {product.stock > 0 ? (
                    <FaCheck className={stockStatus.color} />
                  ) : (
                    <FaTimes className={stockStatus.color} />
                  )}
                  <span className={`font-medium ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                </div>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Color</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                            selectedColor === color
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                            selectedSize === size
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-600">
                      Max: {product.stock} units
                    </span>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Product Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  {product.warranty && product.warranty !== "No Warranty" && (
                    <div className="flex items-center gap-3 text-sm">
                      <FaShieldAlt className="text-green-600" />
                      <span className="text-gray-700">{product.warranty}</span>
                    </div>
                  )}

                  {product.returnPolicyDays && (
                    <div className="flex items-center gap-3 text-sm">
                      <FaExchangeAlt className="text-blue-600" />
                      <span className="text-gray-700">
                        {product.returnPolicyDays}-day return policy
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <FaTruck className="text-purple-600" />
                    <span className="text-gray-700">Free shipping</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <FaCreditCard />
                  Buy Now
                </button>

                <button
                  onClick={handleWishlistToggle}
                  disabled={!token}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
                    isInWishlist
                      ? "bg-red-100 text-red-600 border-red-200 hover:bg-red-200"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <FaHeart className={isInWishlist ? "fill-current" : ""} />
                  {isInWishlist ? "Saved" : "Wishlist"}
                </button>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Product Specifications */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Product Details</h3>
                <div className="space-y-2 text-sm">
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{product.weight} kg</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions:</span>
                      <span className="font-medium">
                        {product.dimensions.length} × {product.dimensions.width}{" "}
                        × {product.dimensions.height} cm
                      </span>
                    </div>
                  )}
                  {product.gender && product.gender !== "unisex" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium capitalize">
                        {product.gender}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Badges */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {product.isFeatured && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <FaStar size={12} />
                      Featured
                    </span>
                  )}
                  {product.isNewArrival && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <FaTag size={12} />
                      New Arrival
                    </span>
                  )}
                  {product.isTrending && (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <FaStar size={12} />
                      Trending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProductDetail;
