import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, CalendarDays, IndianRupee, Tag, MessageSquare, Briefcase, Settings } from "lucide-react";

const links = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/providers", label: "Providers", icon: UserCheck },
  { path: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { path: "/admin/earnings", label: "Earnings", icon: IndianRupee },
  { path: "/admin/coupons", label: "Coupons", icon: Tag },
  { path: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { path: "/admin/services", label: "Services", icon: Briefcase },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r border-gray-200 bg-white sticky top-0 py-6">
      <div className="px-6 mb-8">
        <Link to="/admin" className="flex items-center space-x-2">
          <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent tracking-tight">
            RozSewa Admin
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <link.icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="px-6 mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Super User</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
