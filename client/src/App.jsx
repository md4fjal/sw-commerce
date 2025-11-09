import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import UserLayout from "./layouts/userLayout";
import AdminLayout from "./layouts/adminLayout";
import Loader from "./components/loader";
import ScrollTop from "./components/scrollTop";

// User Pages
const Home = lazy(() => import("./pages/home"));
const Shop = lazy(() => import("./pages/shop"));
const Category = lazy(() => import("./pages/category"));
const Contact = lazy(() => import("./pages/contact"));
const About = lazy(() => import("./pages/about"));
const UserProductDetail = lazy(() => import("./pages/userProjectDetail"));
const Cart = lazy(() => import("./pages/cart"));
const Wishlist = lazy(() => import("./pages/wishlist"));
const Checkout = lazy(() => import("./pages/checkout"));
const OrderSuccess = lazy(() => import("./pages/orderSuccess"));
const MyOrders = lazy(() => import("./pages/myOrders"));
const OrderDetail = lazy(() => import("./pages/orderDetail"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Profile = lazy(() => import("./pages/profile"));
const ChangePassword = lazy(() => import("./pages/changePassword"));
const AccessDenied = lazy(() => import("./pages/accessDenied"));
const NotFound = lazy(() => import("./pages/notfound"));

// Admin Pages
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Users = lazy(() => import("./pages/admin/users"));
const Categories = lazy(() => import("./pages/admin/categories/categories"));
const Products = lazy(() => import("./pages/admin/products/products"));
const AddProduct = lazy(() => import("./pages/admin/products/addProduct"));
const ProductDetails = lazy(() =>
  import("./pages/admin/products/productDetail")
);
const UpdateProduct = lazy(() =>
  import("./pages/admin/products/updateProduct")
);
const Orders = lazy(() => import("./pages/admin/orders/orders"));

function App() {
  return (
    <BrowserRouter>
      <ScrollTop />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* USER LAYOUT */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*" element={<NotFound />} />

            {/* Protected User Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:slug"
              element={
                <ProtectedRoute>
                  <UserProductDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:orderId"
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ADMIN LAYOUT */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="products/:id/edit" element={<UpdateProduct />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
