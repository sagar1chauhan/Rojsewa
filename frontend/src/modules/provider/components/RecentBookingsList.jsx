import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Clock, MapPin, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const RecentBookingsList = () => {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const { toast } = useToast();

  const fetchBookings = () => {
    const allBookings = JSON.parse(localStorage.getItem("rozsewa_bookings") || "[]");
    setRequests(allBookings);
  };

  useEffect(() => {
    fetchBookings();
    window.addEventListener("storage", fetchBookings);
    return () => window.removeEventListener("storage", fetchBookings);
  }, []);

  const handleAction = (id, action) => {
    // Read all bookings
    const allBookings = JSON.parse(localStorage.getItem("rozsewa_bookings") || "[]");
    
    // Get Provider Info
    const providerProfile = JSON.parse(localStorage.getItem("rozsewa_provider_profile") || '{"shopName": "Your Business", "ownerName": "Provider"}');
    const providerName = providerProfile.shopName || providerProfile.ownerName;

    const updatedBookings = allBookings.map(b => {
      if (b.id === id) {
        let newStatus = b.status;
        if (action === 'accept') newStatus = 'active';
        if (action === 'reject') newStatus = 'cancelled';
        if (action === 'complete') newStatus = 'completed';

        return {
          ...b,
          status: newStatus,
          provider: providerName,
          providerId: b.providerId || "PROV-88" 
        };
      }
      return b;
    });

    // Save back to local storage
    localStorage.setItem("rozsewa_bookings", JSON.stringify(updatedBookings));

    // Update local state
    setRequests(updatedBookings);
    
    let title = "Action Success";
    if (action === 'accept') title = "Booking Accepted";
    if (action === 'reject') title = "Booking Rejected";
    if (action === 'complete') title = "Job Completed!";

    toast({
       title,
       description: `Booking ${id} status updated to ${action === 'complete' ? 'completed' : action + 'ed'}.`,
       variant: action === 'reject' ? "destructive" : "default"
    });
  };

  const filteredRequests = requests.filter(req => req.status === activeTab);
  const counts = {
    pending: requests.filter(r => r.status === "pending").length,
    active: requests.filter(r => r.status === "active").length,
    cancelled: requests.filter(r => r.status === "cancelled").length,
    completed: requests.filter(r => r.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-muted rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
        {[
          { id: "pending", label: "New", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" },
          { id: "active", label: "Accepted", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400" },
          { id: "completed", label: "Completed", color: "text-emerald-700 bg-emerald-100 dark:bg-emerald-800/30 dark:text-emerald-300" },
          { id: "cancelled", label: "Rejected", color: "text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                activeTab === tab.id ? tab.color : "bg-muted-foreground/20"
              }`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {filteredRequests.length === 0 ? (
          <motion.div
            key={`empty-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-3xl"
          >
            <div className="rounded-full bg-muted p-6 mb-4">
              <Clock className="h-10 w-10 text-muted-foreground opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No {activeTab} bookings</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">When you have {activeTab} service requests, they will appear here.</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map(req => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative overflow-hidden rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md ${
                  req.emergency ? 'border-red-500/30 ring-1 ring-red-500/10' : 'border-border'
                }`}
              >
                {req.emergency && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-red-500 px-3 py-1">
                     <span className="flex items-center gap-1 text-[10px] font-black text-white">
                       <AlertTriangle className="h-3 w-3" /> EMERGENCY
                     </span>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black tracking-wider text-muted-foreground uppercase">{req.id}</span>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    req.status === 'pending' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                    req.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                    req.status === 'completed' ? 'bg-emerald-500 text-white' :
                    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                  }`}>
                    {req.status === 'pending' ? 'NEW' : req.status.toUpperCase()}
                  </div>
                </div>

                <h3 className="text-lg font-black text-foreground truncate">{req.service || "Service"}</h3>
                <p className="text-sm font-bold text-muted-foreground">{req.user || "Customer"}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{req.amount || 0}</div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg max-w-[140px]">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{typeof req.address === 'object' ? req.address?.address : req.address || "Local"}</span>
                  </div>
                </div>

                {req.status === "pending" && (
                  <div className="mt-5 flex gap-3">
                    <button 
                      onClick={() => handleAction(req.id, 'reject')}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-rose-500/10 bg-rose-500/5 py-2.5 text-sm font-bold text-rose-600 transition-all hover:bg-rose-500 hover:text-white active:scale-95"
                    >
                      <X className="h-4 w-4" /> Reject
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'accept')}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    >
                      <Check className="h-4 w-4" /> Accept
                    </button>
                  </div>
                )}

                {req.status === "active" && (
                  <div className="mt-5">
                    <button 
                      onClick={() => handleAction(req.id, 'complete')}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-500/20 bg-emerald-500/5 py-2.5 text-sm font-bold text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white"
                    >
                      <Check className="h-4 w-4" /> Mark as Completed
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecentBookingsList;
