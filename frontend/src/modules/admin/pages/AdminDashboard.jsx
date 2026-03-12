import { useState, useEffect } from "react";
import { Users, UserCheck, CalendarDays, IndianRupee, ArrowUpRight } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import StatCard from "../components/StatCard";
import { Link } from "react-router-dom";

const statusColors = {
  completed: "bg-emerald-100 text-emerald-700",
  active: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
};

const AdminDashboard = () => {
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = () => {
      const allBookings = JSON.parse(localStorage.getItem("rozsewa_bookings") || "[]");
      setRecentBookings(allBookings.slice(0, 5)); // First 5
    };
    fetchBookings();
    
    window.addEventListener("storage", fetchBookings);
    return () => window.removeEventListener("storage", fetchBookings);
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Welcome back, Admin 👋</h2>
          <p className="mt-1 text-sm text-gray-500">Here's what's happening on RozSewa today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value="24.5K" icon={Users} trend="up" trendValue="+12%" />
          <StatCard title="Total Providers" value="1,248" icon={UserCheck} trend="up" trendValue="+5%" />
          <StatCard title="Active Bookings" value="142" icon={CalendarDays} trend="up" trendValue="+8%" />
          <StatCard title="Revenue (Today)" value="₹12,450" icon={IndianRupee} trend="down" trendValue="-2%" />
        </div>

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Recent Bookings List */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
              <Link to="/admin/bookings" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View All <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="pb-3 font-semibold">Booking ID</th>
                    <th className="pb-3 font-semibold">User & Provider</th>
                    <th className="pb-3 font-semibold">Service</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-4 font-mono font-medium text-gray-900">{b.id}</td>
                      <td className="py-4">
                        <p className="font-bold text-gray-900">{b.user}</p>
                        <p className="text-xs text-gray-500">via {b.provider}</p>
                      </td>
                      <td className="py-4 text-gray-600">{b.service}
                        <p className="text-xs text-gray-400">{b.date} • {b.time}</p>
                      </td>
                      <td className="py-4 font-bold text-gray-900">₹{b.amount}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusColors[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Approvals</h3>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-700 font-bold">NP</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">New Provider #{i}</p>
                        <p className="text-[10px] font-semibold text-amber-700 uppercase">Documents Pending Check</p>
                      </div>
                    </div>
                    <Link to="/admin/providers" className="flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm hover:bg-gray-50">
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Platform Health</h3>
              <p className="text-sm text-emerald-700 mb-4">All systems are running smoothly. No critical issues reported.</p>
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  API Online
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  Database Fast
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
