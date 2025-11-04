import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/sidebar";
import { Toaster } from "react-hot-toast";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      {/* Main Content with sidebar spacing */}
      <main className="flex-1 ml-64 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Enhanced Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#374151",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            borderRadius: "12px",
            border: "1px solid #f3f4f6",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            style: {
              borderLeft: "4px solid #10B981",
            },
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            style: {
              borderLeft: "4px solid #EF4444",
            },
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
          loading: {
            style: {
              borderLeft: "4px solid #6366F1",
            },
          },
        }}
      />
    </div>
  );
};

export default AdminLayout;
