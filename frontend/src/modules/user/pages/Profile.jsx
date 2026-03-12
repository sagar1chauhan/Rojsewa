import { useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Phone, Mail, ChevronRight, Wallet, Star, Clock, Settings, LogOut, Bell, Shield, Gift, Heart, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const menuItems = [
  { icon: Clock, label: "My Bookings", desc: "View booking history", path: "/my-bookings" },
  { icon: Wallet, label: "Wallet & Cashback", desc: "₹250 available", path: "/wallet" },
  { icon: Heart, label: "Favorites", desc: "Saved providers", path: "/favorites" },
  { icon: MapPin, label: "Saved Addresses", desc: "Home, Office & more", path: "/addresses" },
  { icon: Gift, label: "Refer & Earn", desc: "Invite friends, get ₹100", path: "/refer-earn" },
  { icon: Bell, label: "Notifications", desc: "Manage alerts", path: "/notifications" },
  { icon: HelpCircle, label: "Help & Support", desc: "FAQs, chat with us", path: "/help-support" },
];

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-card-foreground">Sagar Chauhan</h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" /> +91 98765 43210</div>
              <div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-3.5 w-3.5" /> sagar@rojsewa.com</div>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Bookings", value: "24", icon: Clock, color: "text-primary" },
            { label: "Cashback", value: "₹250", icon: Wallet, color: "text-secondary" },
            { label: "Rating", value: "4.9", icon: Star, color: "text-secondary" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-lg font-extrabold text-card-foreground">{stat.value}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="space-y-2">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} whileTap={{ scale: 0.98 }} onClick={() => item.path && navigate(item.path)} className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-card-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            );
          })}
        </div>

        <motion.button whileTap={{ scale: 0.97 }} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-destructive/20 bg-destructive/5 py-3.5 text-sm font-bold text-destructive transition-colors hover:bg-destructive/10">
          <LogOut className="h-4 w-4" /> Logout
        </motion.button>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
