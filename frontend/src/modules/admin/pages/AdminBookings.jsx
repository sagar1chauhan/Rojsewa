import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Download, CalendarDays, IndianRupee, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const AdminBookings = () => {
  const { setTitle } = useOutletContext();
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    setTitle("Manage Bookings");
    
    // Fetch all bookings from local storage
    const fetchBookings = () => {
      const allBookings = JSON.parse(localStorage.getItem("rozsewa_bookings") || "[]");
      setBookings(allBookings);
    };
    
    fetchBookings();
    
    // Optional: listen for storage changes across tabs to update live
    window.addEventListener("storage", fetchBookings);
    return () => window.removeEventListener("storage", fetchBookings);
  }, [setTitle]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookings, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "rozsewa_all_bookings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Export Successful", description: "Bookings data has been downloaded as JSON." });
  };

  const filteredBookings = bookings.filter(b => {
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = (b.user || "").toLowerCase().includes(searchLow) || 
                          (b.provider || "").toLowerCase().includes(searchLow) ||
                          (b.id || "").toLowerCase().includes(searchLow);
    const matchesFilter = filter === "all" || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Platform Bookings</h2>
          <p className="mt-1 text-sm text-gray-500">View and track all service requests across RozSewa.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 scrollbar-hide">
           <button
              onClick={handleExport}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
        </div>
      </div>

       {/* Filters & Search */}
       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex rounded-xl bg-gray-100 p-1 w-full sm:w-auto overflow-x-auto scrollbar-hide pb-0">
            {["all", "pending", "active", "completed", "cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none rounded-lg px-4 py-2 text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                  filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:min-w-[300px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all"
              placeholder="Search booking ID, user, provider..."
            />
          </div>
        </div>

      {/* Bookings Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="py-4 px-6 font-bold">Booking Details</th>
                <th className="py-4 px-6 font-bold">User</th>
                <th className="py-4 px-6 font-bold">Provider & Service</th>
                <th className="py-4 px-6 font-bold">Amount</th>
                <th className="py-4 px-6 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500 font-medium">No bookings found.</td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <motion.tr key={booking.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-mono font-bold text-gray-900">{booking.id}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <CalendarDays className="h-3.5 w-3.5" /> {booking.date} at {booking.time}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900">{booking.user}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate max-w-[150px]" title={typeof booking.address === 'object' ? booking.address?.address : booking.address}>{typeof booking.address === 'object' ? booking.address?.address : booking.address}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100 mb-1.5 line-clamp-1 max-w-[180px]">
                        {booking.service}
                      </span>
                      <p className="text-xs font-semibold text-gray-600 mt-0.5">via {booking.provider}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="flex items-center gap-1 font-extrabold text-gray-900 text-base">
                        <IndianRupee className="h-4 w-4" /> {booking.amount}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border capitalize tracking-wide bg-gray-50 text-gray-700`}>
                         {booking.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
