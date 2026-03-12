import { motion } from "framer-motion";
import { ArrowLeft, Wallet, TrendingUp, Download, IndianRupee, History, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const transactions = [
  { id: "TXN-001", type: "Cashback", title: "Referral Bonus", amount: 100, date: "Mar 10, 2026", status: "credited" },
  { id: "TXN-002", type: "Payment", title: "AC Repair Payment", amount: -499, date: "Mar 08, 2026", status: "debited" },
  { id: "TXN-003", type: "Refund", title: "Cancelled Booking", amount: 250, date: "Mar 05, 2026", status: "credited" },
];

const WalletPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="text-xl font-bold text-foreground">RojSewa Wallet</h1>
        </div>

        {/* Balance Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[32px] bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Available Balance</p>
              <h2 className="mt-2 text-5xl font-black flex items-center gap-1">₹250</h2>
            </div>
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md">
              <Wallet className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <motion.button whileTap={{ scale: 0.95 }} className="flex-1 rounded-2xl bg-white py-3 text-sm font-bold text-emerald-700">Add Money</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} className="flex-1 rounded-2xl bg-emerald-500/30 py-3 text-sm font-bold text-white border border-white/20 backdrop-blur-md">Withdraw</motion.button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
           <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-emerald-600" /></div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Earned</p>
                <p className="text-sm font-black text-foreground">₹1,450</p>
              </div>
           </div>
           <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center"><Download className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Spent</p>
                <p className="text-sm font-black text-foreground">₹8,920</p>
              </div>
           </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><History className="h-5 w-5 text-primary" /> History</h3>
            <button className="text-xs font-bold text-primary">See All</button>
          </div>
          <div className="space-y-3">
            {transactions.map((txn) => (
              <motion.div key={txn.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${txn.status === 'credited' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    {txn.status === 'credited' ? <TrendingUp className={`h-5 w-5 ${txn.status === 'credited' ? 'text-emerald-600' : 'text-rose-600'}`} /> : <IndianRupee className="h-5 w-5 text-rose-600" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{txn.title}</h4>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase">{txn.date} • {txn.id}</p>
                  </div>
                </div>
                <p className={`font-black text-sm ${txn.status === 'credited' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {txn.status === 'credited' ? '+' : '-'}₹{Math.abs(txn.amount)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default WalletPage;
