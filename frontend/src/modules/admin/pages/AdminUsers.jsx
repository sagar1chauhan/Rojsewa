import { useState, useEffect } from "react";
import { Search, MoreVertical, ShieldAlert, CheckCircle2, Ban } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { motion } from "framer-motion";

const demoUsers = [
  { id: "USR-001", name: "Sagar Chauhan", mobile: "+91 9876543210", email: "sagar@example.com", joined: "2026-03-01", status: "active", bookings: 12 },
  { id: "USR-002", name: "Rahul Sharma", mobile: "+91 8765432109", email: "rahul@example.com", joined: "2026-03-05", status: "blocked", bookings: 2 },
  { id: "USR-003", name: "Priya Singh", mobile: "+91 7654321098", email: "priya@example.com", joined: "2026-03-08", status: "active", bookings: 5 },
  { id: "USR-004", name: "Amit Patel", mobile: "+91 6543210987", email: "amit@example.com", joined: "2026-03-09", status: "active", bookings: 0 },
  { id: "USR-005", name: "Neha Gupta", mobile: "+91 5432109876", email: "neha@example.com", joined: "2026-03-10", status: "active", bookings: 1 },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(demoUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "active" ? "blocked" : "active" };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.mobile.includes(searchTerm) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Users">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Platform Users</h2>
            <p className="mt-1 text-sm text-gray-500">View and manage all registered customers.</p>
          </div>
          
          <div className="relative w-full sm:w-auto min-w-[300px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Search by name, ID, or mobile..."
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="py-4 px-6 font-bold">User Details</th>
                  <th className="py-4 px-6 font-bold">Contact Info</th>
                  <th className="py-4 px-6 font-bold">Bookings</th>
                  <th className="py-4 px-6 font-bold">Joined On</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">No users found matching your search.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.tr key={user.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm ${
                            user.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs font-mono text-gray-500">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900">{user.mobile}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100">
                          {user.bookings} total
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{user.joined}</td>
                      <td className="py-4 px-6">
                        {user.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 border border-red-100">
                            <ShieldAlert className="h-3.5 w-3.5" /> Blocked
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                            user.status === "active" 
                              ? "bg-red-50 text-red-600 hover:bg-red-100" 
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          <Ban className="h-3.5 w-3.5" /> 
                          {user.status === "active" ? "Block" : "Unblock"}
                        </button>
                        <button className="ml-2 inline-flex rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
