import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, CalendarDays, BarChart3 } from "lucide-react";

import { useState, useEffect } from "react";

const EarningsWidget = () => {
  const [stats, setStats] = useState([
    { title: "Today's Income", amount: "₹0", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
    { title: "This Week", amount: "₹0", icon: CalendarDays, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
    { title: "This Month", amount: "₹0", icon: BarChart3, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
  ]);

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem("rozsewa_bookings") || "[]");
    const completed = allBookings.filter(b => b.status === "completed");
    
    let today = 0, week = 0, month = 0;
    const now = new Date();
    
    completed.forEach(b => {
       let bDate = new Date(b.date || b.timestamp || Date.now()); 
       let amt = parseFloat(b.amount || 0);
       
       month += amt; // Assuming all history is this month for the prototype
       if (now - bDate < 7 * 24 * 60 * 60 * 1000) week += amt;
       if (now.toDateString() === bDate.toDateString()) today += amt;
    });

    setStats([
      { title: "Today's Income", amount: `₹${today.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
      { title: "This Week", amount: `₹${week.toLocaleString()}`, icon: CalendarDays, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
      { title: "This Month", amount: `₹${month.toLocaleString()}`, icon: BarChart3, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
            <h3 className="text-xl font-bold flex items-center text-foreground">
              {stat.amount}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EarningsWidget;
