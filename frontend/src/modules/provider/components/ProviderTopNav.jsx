import { motion } from "framer-motion";
import { Bell, Menu, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ProviderTopNav = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-[#212121] dark:border-[#212121] shadow-sm">
      <div className="container flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Left: Logo/Brand */}
        <div className="flex items-center gap-2">
          <Link to="/provider" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              RozSewa Pro
            </span>
          </Link>
        </div>

        {/* Center: Desktop Nav (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/provider" className="text-sm font-semibold text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Dashboard</Link>
          <Link to="/provider/bookings" className="text-sm font-semibold text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Bookings</Link>
          <Link to="/provider/staff" className="text-sm font-semibold text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Staff</Link>
          <Link to="/provider/earnings" className="text-sm font-semibold text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Wallet</Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <motion.div whileTap={{ scale: 0.9 }}>
            <div className="relative cursor-pointer rounded-full bg-muted/50 p-2 hover:bg-muted">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive"></span>
            </div>
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }}>
            <Link to="/provider/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              <UserCircle className="h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default ProviderTopNav;
