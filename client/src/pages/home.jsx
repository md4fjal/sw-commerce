import {
  FaArrowRight,
  FaStar,
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaCreditCard,
  FaFire,
  FaClock,
  FaTag,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import { addToCart } from "../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/slices/wishlistSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { products, loading: productLoading } = useSelector(
    (state) => state.product
  );
  const { categories, loading: categoryLoading } = useSelector(
    (state) => state.category
  );
  const { wishlist } = useSelector((state) => state.wishlist);

  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 12, sortBy: "createdAt", order: "desc" }));
    dispatch(fetchCategories({}));
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const featured = products
        .filter((product) => product.isFeatured)
        .slice(0, 4);
      setFeaturedProducts(featured);

      const newArrivalsList = products
        .filter((product) => product.isNewArrival)
        .slice(0, 4);
      setNewArrivals(newArrivalsList);

      const trending = products
        .filter((product) => product.isTrending)
        .slice(0, 4);
      setTrendingProducts(trending);
    }
  }, [products]);

  const features = [
    {
      icon: FaStar,
      title: "Premium Quality",
      description: "Handpicked items with the highest quality standards",
    },
    {
      icon: FaShippingFast,
      title: "Fast Delivery",
      description: "Free shipping on orders over ₹500",
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payment",
      description: "Your payments are safe and secure",
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "We're here to help you anytime",
    },
  ];

  const handleAddToCart = (productId, quantity = 1) => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ token, productId, quantity }));
  };

  const handleWishlist = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    const isInWishlist = wishlist.some((item) => item._id === product._id);
    if (isInWishlist) {
      dispatch(removeFromWishlist({ token, productId: product._id }));
    } else {
      dispatch(addToWishlist({ token, productId: product._id }));
    }
  };

  const handleBuyNow = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ token, productId: product._id, quantity: 1 }));
    navigate("/cart");
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getDisplayPrice = (product) => {
    if (product.salePrice && product.salePrice < product.price) {
      return (
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-green-600">
            ₹{product.salePrice}
          </p>
          <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
        </div>
      );
    }
    return <p className="text-lg font-bold text-blue-600">₹{product.price}</p>;
  };

  const getProductBadge = (product) => {
    if (product.stock === 0)
      return { label: "Out of Stock", color: "bg-red-500" };
    if (product.isNewArrival) return { label: "New", color: "bg-purple-500" };
    if (product.isFeatured) return { label: "Featured", color: "bg-blue-500" };
    if (product.isTrending)
      return { label: "Trending", color: "bg-orange-500" };
    if (product.salePrice && product.salePrice < product.price)
      return { label: "Sale", color: "bg-green-500" };
    return null;
  };

  const ProductCard = ({ product }) => {
    const badge = getProductBadge(product);

    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group relative">
        <Link to={`/product/${product.slug}`}>
          <div className="relative overflow-hidden bg-gray-100">
            <img
              src={product.images?.[0]?.url || "/placeholder.jpg"}
              alt={product.images?.[0]?.alt || product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {badge && (
              <div className="absolute top-3 left-3">
                <span
                  className={`${badge.color} text-white px-2 py-1 rounded text-xs font-medium`}
                >
                  {badge.label}
                </span>
              </div>
            )}

            {/* Rating */}
            {product.rating > 0 && (
              <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <FaStar className="text-yellow-400" size={10} />
                <span>{product.rating}</span>
              </div>
            )}
          </div>
        </Link>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isInWishlist(product._id)
              ? "bg-red-500 text-white"
              : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          <FaHeart size={14} />
        </button>

        <div className="p-4">
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              {product.brand} • {product.category?.name}
            </p>
          </Link>

          {getDisplayPrice(product)}

          <p
            className={`text-xs mt-2 ${
              product.stock === 0
                ? "text-red-600"
                : product.stock < 10
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product._id);
              }}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-colors text-sm ${
                product.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <FaShoppingCart size={12} />
              Cart
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBuyNow(product);
              }}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-colors text-sm ${
                product.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <FaCreditCard size={12} />
              Buy
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProductSection = ({
    title,
    icon: Icon,
    products,
    viewAllLink,
    viewAllText,
  }) => (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="text-2xl text-blue-600" />}
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={() => navigate(viewAllLink)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <span>{viewAllText || "View All"}</span>
            <FaArrowRight className="text-sm" />
          </button>
        </div>

        {productLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
              No products found in this section
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name, brand, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pl-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-500"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              FashionStore
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Discover the latest trends in fashion with our exclusive collection.
            Quality products at unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/shop")}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:scale-105 flex items-center space-x-2"
            >
              <span>Shop Now</span>
              <FaArrowRight className="text-sm" />
            </button>
            <button
              onClick={() => navigate("/shop?isNewArrival=true")}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              New Arrivals
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Explore our wide range of categories
            </p>
          </div>

          {categoryLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories?.map((category) => (
                <div
                  key={category._id}
                  onClick={() => navigate(`/shop?category=${category._id}`)}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer p-6 text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gray-100 group-hover:bg-blue-50 transition-colors flex items-center justify-center overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image.url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaTag className="text-2xl text-blue-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.productCount || 0} products
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/categories")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:scale-105"
            >
              View All Categories
            </button>
          </div>
        </div>
      </section>

      <ProductSection
        title="Featured Products"
        icon={FaStar}
        products={featuredProducts}
        viewAllLink="/shop?isFeatured=true"
        viewAllText="View All Featured"
      />

      <ProductSection
        title="New Arrivals"
        icon={FaClock}
        products={newArrivals}
        viewAllLink="/shop?isNewArrival=true"
        viewAllText="View All New Arrivals"
      />

      <ProductSection
        title="Trending Now"
        icon={FaFire}
        products={trendingProducts}
        viewAllLink="/shop?isTrending=true"
        viewAllText="View All Trending"
      />

      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Upgrade Your Style?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust us for their fashion
            needs. Start your shopping journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/shop")}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:scale-105"
            >
              Start Shopping
            </button>
            <button
              onClick={() => navigate("/shop?isNewArrival=true")}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Explore New Arrivals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
