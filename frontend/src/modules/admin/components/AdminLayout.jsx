import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopNav from "./AdminTopNav";
import AdminMobileNav from "./AdminMobileNav";

const AdminLayout = ({ title, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("rozsewa_admin_token");
    if (!token) {
      navigate("/admin/login");
    }
    // Force light mode for admin module
    document.documentElement.classList.remove("dark");
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans light selection:bg-emerald-200">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopNav title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
        <AdminMobileNav />
      </div>
    </div>
  );
};

export default AdminLayout;
