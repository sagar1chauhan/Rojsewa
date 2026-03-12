import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Plus, Home, Briefcase, Navigation, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const addresses = [
  { id: "addr-1", type: "Home", icon: Home, address: "H-24, Sector 62, Noida, Uttar Pradesh 201301", isDefault: true },
  { id: "addr-2", type: "Office", icon: Briefcase, address: "B-Block, 4th Floor, Sector 18, Lucknow, UP 226010", isDefault: false },
];

const Addresses = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <h1 className="text-xl font-bold text-foreground">Saved Addresses</h1>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Add New
          </motion.button>
        </div>

        <div className="space-y-4">
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-2xl border-2 p-4 transition-all ${addr.isDefault ? 'border-primary/20 bg-primary/5' : 'border-border bg-card'}`}
            >
              <div className="flex gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${addr.isDefault ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <addr.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-foreground">{addr.type}</h3>
                    {addr.isDefault && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase text-primary">Default</span>}
                  </div>
                  <p className="mt-1 text-sm font-medium text-muted-foreground line-clamp-2">{addr.address}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 border-t border-border/50 pt-3">
                 <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-muted/50 py-2.5 text-xs font-bold text-foreground hover:bg-muted">
                   <Navigation className="h-3.5 w-3.5" /> Edit
                 </button>
                 <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20">
                   <Trash2 className="h-4 w-4" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl border-2 border-dashed border-border p-8 flex flex-col items-center justify-center text-center">
           <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
             <Plus className="h-6 w-6 text-muted-foreground" />
           </div>
           <p className="text-sm font-bold text-muted-foreground">Add another location to get faster checkouts</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Addresses;
