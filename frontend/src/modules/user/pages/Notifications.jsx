import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell, Package, Tag, Info, Trash2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const initialNotifications = [
  { id: 1, type: "order", title: "Booking Confirmed", desc: "Your AC Repair booking for 2:00 PM is confirmed.", time: "2 mins ago", unread: true },
  { id: 2, type: "offer", title: "Weekend Mega Sale!", desc: "Get flat 40% OFF on all Salon services.", time: "1 hour ago", unread: true },
  { id: 3, type: "info", title: "Welcome to RozSewa!", desc: "Thanks for joining. Start booking services now.", time: "1 day ago", unread: false },
];

const Notifications = () => {
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch(type) {
      case 'order': return <Package className="h-5 w-5 text-blue-600" />;
      case 'offer': return <Tag className="h-5 w-5 text-emerald-600" />;
      default: return <Info className="h-5 w-5 text-amber-600" />;
    }
  };

  const getBg = (type) => {
    switch(type) {
      case 'order': return 'bg-blue-100';
      case 'offer': return 'bg-emerald-100';
      default: return 'bg-amber-100';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          </div>
          <button className="text-xs font-bold text-primary flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Mark all read
          </button>
        </div>

        <div className="space-y-3">
          {initialNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <p className="text-sm font-bold text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <AnimatePresence>
              {initialNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative flex gap-4 rounded-2xl border p-4 transition-all ${notif.unread ? 'border-primary/20 bg-primary/5' : 'border-border bg-card opacity-80'}`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getBg(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-black text-foreground">{notif.title}</h3>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{notif.time}</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">{notif.desc}</p>
                    {notif.unread && (
                      <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <button className="flex w-full items-center justify-center gap-2 py-4 text-xs font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-colors mt-8">
          <Trash2 className="h-4 w-4" /> Clear All Notifications
        </button>
      </main>
      <BottomNav />
    </div>
  );
};

export default Notifications;
