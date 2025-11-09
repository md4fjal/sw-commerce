import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import { addToCart } from "../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../redux/slices/wishlistSlice";
import {
  FaHeart,
  FaShoppingCart,
  FaCreditCard,
  FaSearch,
  FaFilter,
  FaTimes,
  FaFire,
  FaClock,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";
import { GiPriceTag } from "react-icons/gi";
import Loader from "../components/loader";
import useDebounce from "../hooks/useDebounce";

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  const {
    products,
    loading: productsLoading,
    total,
    pages,
    page,
  } = useSelector((state) => state.product);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.category
  );
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  const urlParams = new URLSearchParams(location.search);

  const [selectedCategory, setSelectedCategory] = useState(
    urlParams.get("category") || ""
  );
  const [selectedBrand, setSelectedBrand] = useState(
    urlParams.get("brand") || ""
  );
  const [selectedGender, setSelectedGender] = useState(
    urlParams.get("gender") || ""
  );
  const [searchQuery, setSearchQuery] = useState(urlParams.get("search") || "");
  const [priceRange, setPriceRange] = useState([
    Number(urlParams.get("minPrice")) || 0,
    Number(urlParams.get("maxPrice")) || 100000,
  ]);
  const [sortBy, setSortBy] = useState(urlParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(urlParams.get("order") || "desc");
  const [currentPage, setCurrentPage] = useState(
    Number(urlParams.get("page")) || 1
  );
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [inStockFilter, setInStockFilter] = useState(
    urlParams.get("inStock") === "true"
  );
  const [featuredFilter, setFeaturedFilter] = useState(
    urlParams.get("isFeatured") === "true"
  );
  const [newArrivalFilter, setNewArrivalFilter] = useState(
    urlParams.get("isNewArrival") === "true"
  );
  const [trendingFilter, setTrendingFilter] = useState(
    urlParams.get("isTrending") === "true"
  );

  const [hasMore, setHasMore] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [currentPageState, setCurrentPageState] = useState(1);

  const wishlistItems = useMemo(
    () => new Set(wishlist.map((item) => item._id)),
    [wishlist]
  );

  const brands = useMemo(() => {
    return [
      ...new Set(products.map((product) => product.brand).filter(Boolean)),
    ];
  }, [products]);

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  useEffect(() => {
    setAllProducts([]);
    setCurrentPageState(1);
    setHasMore(true);
  }, [
    debouncedSearchQuery,
    selectedCategory,
    selectedBrand,
    selectedGender,
    sortBy,
    sortOrder,
    priceRange,
    inStockFilter,
    featuredFilter,
    newArrivalFilter,
    trendingFilter,
  ]);

  useEffect(() => {
    if (products.length > 0) {
      if (currentPage === 1) {
        setAllProducts(products);
      } else if (currentPage > currentPageState) {
        setAllProducts((prev) => [...prev, ...products]);
        setCurrentPageState(currentPage);
      }

      setHasMore(currentPage < pages);
    } else if (currentPage === 1) {
      setAllProducts([]);
      setHasMore(false);
    }
  }, [products, currentPage, pages, currentPageState]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearchQuery.trim()) params.set("search", debouncedSearchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedGender) params.set("gender", selectedGender);
    if (sortBy !== "createdAt") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("order", sortOrder);
    if (currentPage !== 1) params.set("page", currentPage);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0]);
    if (priceRange[1] < 100000) params.set("maxPrice", priceRange[1]);
    if (inStockFilter) params.set("inStock", "true");
    if (featuredFilter) params.set("isFeatured", "true");
    if (newArrivalFilter) params.set("isNewArrival", "true");
    if (trendingFilter) params.set("isTrending", "true");

    navigate(`/shop?${params.toString()}`, { replace: true });
  }, [
    debouncedSearchQuery,
    selectedCategory,
    selectedBrand,
    selectedGender,
    sortBy,
    sortOrder,
    currentPage,
    priceRange,
    inStockFilter,
    featuredFilter,
    newArrivalFilter,
    trendingFilter,
    navigate,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        search: urlParams.get("search") || "",
        sortBy: urlParams.get("sortBy") || "createdAt",
        order: urlParams.get("order") || "desc",
        page: Number(urlParams.get("page")) || 1,
        limit: 12,
        category: urlParams.get("category") || "",
        brand: urlParams.get("brand") || "",
        gender: urlParams.get("gender") || "",
        minPrice: urlParams.get("minPrice") || "",
        maxPrice: urlParams.get("maxPrice") || "",
        inStock: urlParams.get("inStock") || "",
        isFeatured: urlParams.get("isFeatured") || "",
        isNewArrival: urlParams.get("isNewArrival") || "",
        isTrending: urlParams.get("isTrending") || "",
      };

      await Promise.all([
        dispatch(fetchProducts(params)),
        dispatch(fetchCategories({})),
        token && dispatch(fetchWishlist({ token })),
      ]);
    };

    fetchData();
  }, [dispatch, token, location.search]);

  const fetchMoreData = useCallback(() => {
    if (currentPage < pages && !productsLoading) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, pages, productsLoading]);

  const handleAddToCart = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ token, productId: product._id, quantity: 1 }));
  };

  const handleBuyNow = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ token, productId: product._id, quantity: 1 }));
    navigate("/cart");
  };

  const handleWishlist = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (wishlistItems.has(product._id)) {
      dispatch(removeFromWishlist({ token, productId: product._id }));
    } else {
      dispatch(addToWishlist({ token, productId: product._id }));
    }
  };

  const isInCart = (productId) => {
    return cart.some((item) => item.product?._id === productId);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedGender("");
    setSearchQuery("");
    setPriceRange([0, 100000]);
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
    setInStockFilter(false);
    setFeaturedFilter(false);
    setNewArrivalFilter(false);
    setTrendingFilter(false);
  };

  const sortOptions = [
    { value: "createdAt", label: "Newest", icon: FaClock },
    { value: "price", label: "Price", icon: FaDollarSign },
    { value: "name", label: "Name", icon: GiPriceTag },
    { value: "stock", label: "Stock", icon: FaFire },
    { value: "rating", label: "Rating", icon: FaStar },
  ];

  const genderOptions = [
    { value: "", label: "All Genders" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "kids", label: "Kids" },
    { value: "unisex", label: "Unisex" },
  ];

  const getProductBadge = (product) => {
    if (product.stock === 0)
      return { label: "Out of Stock", color: "bg-red-500" };
    if (product.isNewArrival)
      return { label: "New Arrival", color: "bg-purple-500" };
    if (product.isFeatured) return { label: "Featured", color: "bg-blue-500" };
    if (product.isTrending)
      return { label: "Trending", color: "bg-orange-500" };
    if (product.salePrice && product.salePrice < product.price)
      return { label: "Sale", color: "bg-green-500" };
    return null;
  };

  const getDisplayPrice = (product) => {
    if (product.salePrice && product.salePrice < product.price) {
      return (
        <div className="flex items-center gap-2">
          <p className="text-xl font-bold text-green-600">
            ₹{product.salePrice}
          </p>
          <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
        </div>
      );
    }
    return <p className="text-xl font-bold text-blue-600">₹{product.price}</p>;
  };

  const maxPrice = useMemo(() => {
    if (allProducts.length === 0) return 100000;
    return Math.max(...allProducts.map((p) => p.salePrice || p.price)) + 1000;
  }, [allProducts]);

  if (productsLoading && allProducts.length === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <form className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by name, brand, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-500"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                List
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaFilter className="text-gray-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {showFilters && (
            <div className="lg:w-80 bg-white rounded-lg border border-gray-200 p-6 h-fit lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <button
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        !selectedCategory
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedCategory("")}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === cat._id
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedCategory(cat._id)}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <button
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        !selectedBrand
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedBrand("")}
                    >
                      All Brands
                    </button>
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedBrand === brand
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedBrand(brand)}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Gender</h4>
                  <div className="space-y-2">
                    {genderOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedGender === option.value
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedGender(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Status</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={inStockFilter}
                        onChange={(e) => setInStockFilter(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      In Stock Only
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={featuredFilter}
                        onChange={(e) => setFeaturedFilter(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={newArrivalFilter}
                        onChange={(e) => setNewArrivalFilter(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      New Arrivals
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={trendingFilter}
                        onChange={(e) => setTrendingFilter(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Trending
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Our Products
                </h1>
                <p className="text-gray-600">
                  {total} {total === 1 ? "product" : "products"} found
                  {allProducts.length > 0 && ` (showing ${allProducts.length})`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort by {option.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                  }
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {sortOrder === "desc" ? "↓" : "↑"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Category:{" "}
                  {categories.find((c) => c._id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory("")}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {selectedBrand && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand("")}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {selectedGender && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Gender:{" "}
                  {genderOptions.find((g) => g.value === selectedGender)?.label}
                  <button onClick={() => setSelectedGender("")}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                  <button onClick={() => setPriceRange([0, maxPrice])}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {inStockFilter && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  In Stock
                  <button onClick={() => setInStockFilter(false)}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {featuredFilter && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Featured
                  <button onClick={() => setFeaturedFilter(false)}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {newArrivalFilter && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  New Arrivals
                  <button onClick={() => setNewArrivalFilter(false)}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {trendingFilter && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Trending
                  <button onClick={() => setTrendingFilter(false)}>
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
            </div>

            <InfiniteScroll
              dataLength={allProducts.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              }
              endMessage={
                allProducts.length > 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>You have seen all {allProducts.length} products</p>
                  </div>
                )
              }
              refreshFunction={clearFilters}
              pullDownToRefresh={false}
            >
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {allProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`group bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden bg-gray-100 ${
                        viewMode === "list" ? "w-48 flex-shrink-0" : ""
                      }`}
                    >
                      <Link to={`/product/${product.slug}`}>
                        <img
                          src={
                            product.images?.[0]?.url || "/placeholder-image.jpg"
                          }
                          alt={product.images?.[0]?.alt || product.name}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                            viewMode === "list" ? "h-48" : "h-48"
                          }`}
                        />
                      </Link>

                      <button
                        onClick={() => handleWishlist(product)}
                        className={`absolute top-3 right-3 p-2 rounded-md transition-all duration-200 ${
                          wishlistItems.has(product._id)
                            ? "bg-red-500 text-white"
                            : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                        }`}
                      >
                        <FaHeart size={14} />
                      </button>

                      {getProductBadge(product) && (
                        <div className="absolute top-3 left-3">
                          <span
                            className={`${
                              getProductBadge(product).color
                            } text-white px-2 py-1 rounded text-xs font-medium`}
                          >
                            {getProductBadge(product).label}
                          </span>
                        </div>
                      )}

                      {isInCart(product._id) && (
                        <div className="absolute bottom-3 right-3">
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                            In Cart
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`p-4 flex-1 ${
                        viewMode === "list"
                          ? "flex flex-col justify-between"
                          : ""
                      }`}
                    >
                      <div className="mb-3">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                          {product.name}
                        </h2>
                        <p className="text-gray-600 text-sm mb-2">
                          {product.brand} • {product.category?.name}
                        </p>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            <FaStar className="text-yellow-400" size={14} />
                            <span className="text-sm text-gray-600">
                              {product.rating} ({product.numReviews} reviews)
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          {getDisplayPrice(product)}
                          <span
                            className={`text-sm ${
                              product.stock === 0
                                ? "text-red-600"
                                : product.stock < 50
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                              product.stock === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            <FaShoppingCart />
                            {isInCart(product._id) ? "Added" : "Cart"}
                          </button>
                          <button
                            onClick={() => handleBuyNow(product)}
                            disabled={product.stock === 0}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                              product.stock === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                          >
                            <FaCreditCard /> Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>

            {allProducts.length === 0 && !productsLoading && (
              <div className="text-center py-16">
                <div className="bg-white rounded-lg p-8 max-w-md mx-auto border border-gray-200">
                  <div className="text-4xl mb-4">🛍️</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Show All Products
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
