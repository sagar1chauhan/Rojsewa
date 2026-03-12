import { motion } from "framer-motion";
import { ArrowLeft, Shield, Key, Eye, Fingerprint, Smartphone, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const Security = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="text-xl font-bold text-foreground">Privacy & Security</h1>
        </div>

        {/* Hero */}
        <div className="rounded-[32px] bg-emerald-600 p-8 text-white flex items-center gap-6 shadow-xl">
           <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
             <Shield className="h-10 w-10" />
           </div>
           <div>
             <h2 className="text-lg font-black italic uppercase">Account Secured</h2>
             <p className="text-xs font-bold opacity-80">Your data is protected by industry standard encryption.</p>
           </div>
        </div>

        <div className="space-y-4">
           <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest px-2">Account Access</h3>
           {[
             { icon: Key, title: "Change Password", desc: "Update your login password regularly", active: true },
             { icon: Smartphone, title: "Login Activity", desc: "Check devices logged into your account", active: true },
             { icon: Eye, title: "Two-Factor Auth", desc: "Enable SMS or App based code entry", active: false },
             { icon: Fingerprint, title: "Biometric Login", desc: "Use face id or fingerprint to login", active: false },
           ].map((item) => (
             <motion.button
               key={item.title}
               whileTap={{ scale: 0.98 }}
               className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:bg-muted/50"
             >
               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                 <item.icon className="h-5 w-5" />
               </div>
               <div className="flex-1 text-left min-w-0">
                 <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                 <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
               </div>
               <div className="flex items-center gap-2">
                 {!item.active && <span className="text-[10px] font-black text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded-full">Coming Soon</span>}
                 <ChevronRight className="h-4 w-4 text-muted-foreground opacity-30" />
               </div>
             </motion.button>
           ))}
        </div>

        <div className="space-y-4">
           <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest px-2">Data Privacy</h3>
           {[
             { title: "Manage Saved Data", desc: "Clear your search and browse history", path: null },
             { title: "Personalization", desc: "Choose how we use your data to recommend", path: null },
             { title: "Delete Account", desc: "Permanently remove your account and data", danger: true },
           ].map((item) => (
             <motion.button
               key={item.title}
               whileTap={{ scale: 0.98 }}
               className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:bg-muted/50"
             >
               <div className="text-left">
                  <h4 className={`text-sm font-bold ${item.danger ? 'text-rose-600' : 'text-foreground'}`}>{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
               </div>
               <ChevronRight className="h-4 w-4 text-muted-foreground opacity-30" />
             </motion.button>
           ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Security;
