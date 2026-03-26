import { useState } from "react";
import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import EarningsWidget from "@/modules/provider/components/EarningsWidget";
import RecentBookingsList from "@/modules/provider/components/RecentBookingsList";
import { Briefcase, CalendarCheck, FileText, Star, ShieldAlert, CreditCard, Tag, Settings, Headset, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const ProviderDashboard = () => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    toast({
      title: !isOnline ? "You are now ONLINE" : "You are now OFFLINE",
      description: !isOnline ? "Customers can now book your services." : "You will not receive new bookings until you go online.",
      variant: !isOnline ? "default" : "destructive"
    });
  };

  const toggleEmergency = () => {
    setIsEmergencyActive(!isEmergencyActive);
    toast({
      title: !isEmergencyActive ? "Emergency Mode ON" : "Emergency Mode OFF",
      description: !isEmergencyActive ? "You will receive high-priority 24x7 requests with extra charges." : "You will only receive standard booking requests.",
    });
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-20 md:pb-8 relative">
      <ProviderTopNav />
      
      <main className="container max-w-6xl px-4 py-6 md:py-8 space-y-6 md:space-y-10">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">Welcome back, Royal Salon 👋</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 text-balance">Here is what is happening with your business today.</p>
          </div>
          
          <div className="flex bg-card border border-border rounded-xl md:rounded-2xl p-1.5 md:p-2 gap-2 shadow-sm w-full md:w-auto shrink-0">
            {/* Online Toggle */}
            <button 
              onClick={toggleOnline}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all focus:outline-none ${
                isOnline 
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200" 
                : "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80"
              }`}
            >
              <div className={`h-2 w-2 md:h-2.5 md:w-2.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></div>
              {isOnline ? "Online" : "Offline"}
            </button>
            
            {/* Emergency Toggle */}
            <button 
              onClick={toggleEmergency}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all focus:outline-none ${
                isEmergencyActive 
                ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200" 
                : "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80"
              }`}
            >
              <ShieldAlert className={`h-3.5 w-3.5 md:h-4 md:w-4 ${isEmergencyActive ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`} />
              Emergency 24x7
            </button>
          </div>
        </section>

        <section>
          <EarningsWidget />
        </section>

        <section>
          <div className="mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-black tracking-tight text-foreground">Manage Business</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Quick access to your platform settings</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {[
              { icon: Briefcase, title: "Services", path: "/provider/services", color: "text-blue-600 bg-blue-50 border-blue-100" },
              { icon: CalendarCheck, title: "Availability", path: "/provider/availability", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
              { icon: Tag, title: "Offers & Deals", path: "/provider/offers", color: "text-pink-600 bg-pink-50 border-pink-100" },
              { icon: Wallet, title: "Wallet", path: "/provider/wallet", color: "text-green-600 bg-green-50 border-green-100" },
              { icon: Star, title: "Reviews", path: "/provider/reviews", color: "text-amber-600 bg-amber-50 border-amber-100" },
              { icon: CreditCard, title: "99 Card Center", path: "/provider/99card", color: "text-emerald-700 bg-emerald-100 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] shadow-emerald-500/20" },
              { icon: FileText, title: "Documents", path: "/provider/documents", color: "text-orange-600 bg-orange-50 border-orange-100" },
              { icon: Headset, title: "Support", path: "/provider/support", color: "text-cyan-600 bg-cyan-50 border-cyan-100" },
              { icon: Settings, title: "Settings", path: "/provider/settings", color: "text-gray-600 bg-gray-100 border-gray-200" }
            ].map((item, idx) => (
              <Link key={idx} to={item.path} className="">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all text-center h-full ${item.title === "99 Card Center" ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200" : ""}`}>
                  <div className={`p-3 md:p-4 rounded-full border ${item.color} mb-2 md:mb-3`}>
                    <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <h3 className="font-bold text-foreground text-xs md:text-sm">{item.title}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <RecentBookingsList />
        </section>
      </main>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderDashboard;
