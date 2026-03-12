import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, MapPin, RotateCcw, ChevronRight, CalendarDays, Package, Receipt, Info, Star } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const demoBookings = [
  { id: "ROJ-A1B2C3", service: "AC Repair & Gas Refill", provider: "CoolTech Services", date: "2026-03-08", time: "10:00 AM", total: 1598, status: "completed", rating: 5 },
  { id: "ROJ-D4E5F6", service: "Men's Haircut + Beard", provider: "Royal Men's Salon", date: "2026-03-05", time: "04:00 PM", total: 350, status: "completed", rating: 4 },
  { id: "ROJ-G7H8I9", service: "Plumbing - Tap Fix", provider: "Quick Fix Plumbers", date: "2026-03-01", time: "11:00 AM", total: 250, status: "cancelled", rating: 0 },
];

const statusColors = {
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
  active: "bg-secondary/10 text-secondary",
  confirmed: "bg-primary/10 text-primary",
};

const ServiceHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState(demoBookings);
  const [sortBy, setSortBy] = useState("rating");
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("rozsewa_bookings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setBookings([...parsed.map(b => ({
        ...b,
        service: b.service || "Booked Service",
        provider: b.provider || "RozSewa Provider",
        rating: b.rating || 0,
        total: b.amount || b.total || 0,
        date: b.date || b.createdAt?.split("T")[0],
        time: b.time || "",
      })), ...demoBookings]);
    }
  }, []);

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-foreground">My Bookings</h1>
            <p className="text-xs text-muted-foreground">{bookings.length} total bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {["all", "completed", "confirmed", "cancelled"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition-all whitespace-nowrap ${
                filter === f ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground hover:bg-muted"
              }`}>
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">No bookings found.</p>
            </div>
          )}
          {filtered.map((booking, i) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusColors[booking.status] || "bg-muted text-muted-foreground"}`}>
                      {booking.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{booking.id}</span>
                  </div>
                  <h3 className="font-bold text-foreground truncate">{booking.service}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{booking.provider}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-base font-extrabold text-foreground">₹{booking.total}</p>
                  {booking.rating > 0 && (
                    <p className="text-xs text-secondary mt-0.5">{"⭐".repeat(booking.rating)}</p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 border-t border-border/50 pt-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" /> {booking.date}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {booking.time}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                {booking.status === "completed" && (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/checkout")}
                    className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition">
                    <RotateCcw className="h-3.5 w-3.5" /> Re-Book
                  </motion.button>
                )}
                {booking.status === "confirmed" && (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/tracking")}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
                    Track <ChevronRight className="h-3.5 w-3.5" />
                  </motion.button>
                )}
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSelectedBooking(booking)}
                    className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition">
                    <Info className="h-3.5 w-3.5" /> Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} onClick={e => e.stopPropagation()}
                className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-card p-6 shadow-2xl">
                <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-muted sm:hidden" />
                <div className="flex items-center gap-4 mb-6">
                   <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <Receipt className="h-6 w-6 text-primary" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-foreground">Booking Details</h3>
                      <p className="text-xs text-muted-foreground">ID: {selectedBooking.id}</p>
                   </div>
                </div>
                
                <div className="space-y-4 rounded-2xl bg-muted/30 p-4">
                   <div className="flex justify-between"><span className="text-sm text-muted-foreground">Service</span><span className="text-sm font-bold text-foreground">{selectedBooking.service}</span></div>
                   <div className="flex justify-between"><span className="text-sm text-muted-foreground">Provider</span><span className="text-sm font-bold text-foreground">{selectedBooking.provider}</span></div>
                   <div className="flex justify-between"><span className="text-sm text-muted-foreground">Date & Time</span><span className="text-sm font-bold text-foreground">{selectedBooking.date} | {selectedBooking.time}</span></div>
                   <div className="flex justify-between"><span className="text-sm text-muted-foreground">Status</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${statusColors[selectedBooking.status]}`}>{selectedBooking.status}</span></div>
                   <div className="border-t border-border mt-2 pt-2 flex justify-between">
                      <span className="font-bold text-foreground">Total Paid</span>
                      <span className="text-lg font-black text-primary">₹{selectedBooking.total}</span>
                   </div>
                </div>

                <div className="mt-6 flex gap-3">
                   <button onClick={() => setSelectedBooking(null)} className="flex-1 rounded-2xl border border-border py-4 text-sm font-extrabold text-foreground hover:bg-muted">Close</button>
                   {selectedBooking.status === "completed" && (
                      <button className="flex-1 rounded-2xl bg-primary py-4 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20">Download Invoice</button>
                   )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
};

export default ServiceHistory;
