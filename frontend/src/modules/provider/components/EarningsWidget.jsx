import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, CalendarDays, BarChart3 } from "lucide-react";

const EarningsWidget = () => {
  const stats = [
    { title: "Today's Income", amount: "₹1,450", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
    { title: "This Week", amount: "₹8,200", icon: CalendarDays, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
    { title: "This Month", amount: "₹32,400", icon: BarChart3, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
  ];

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
