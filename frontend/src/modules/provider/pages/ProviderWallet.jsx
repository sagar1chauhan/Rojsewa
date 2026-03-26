import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import { Wallet, ArrowDownRight, ArrowUpRight, History, Download, Link as LinkIcon, Building2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ProviderWallet = () => {
  const { toast } = useToast();
  const balance = 12500;
  
  const handleWithdraw = () => {
    toast({ title: "Withdrawal Requested", description: "₹5000 requested to ICICI Bank ending with 4011." });
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-20 md:pb-8">
      <ProviderTopNav />
      <main className="container max-w-4xl px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">Wallet & Payouts</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Manage your funds and withdraw instantly.</p>
        </div>

        {/* Balance Card */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 md:p-8 text-white shadow-lg overflow-hidden relative">
           <div className="absolute top-0 right-0 h-40 w-40 -mr-16 -mt-16 rounded-full bg-white/10 blur-2xl"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
             <div>
               <p className="text-sm font-semibold uppercase tracking-wider text-emerald-200 mb-2 flex items-center gap-2">
                 <Wallet className="h-5 w-5" /> Available Balance
               </p>
               <h2 className="text-4xl md:text-5xl font-black">₹{balance.toLocaleString()}</h2>
               <p className="text-xs text-emerald-300 mt-2 font-medium">Last settled: 2 hours ago</p>
             </div>
             
             <button onClick={handleWithdraw} className="w-full md:w-auto mt-4 md:mt-0 px-6 py-3 bg-white text-emerald-800 rounded-xl font-black text-sm hover:bg-emerald-50 transition shadow-sm border border-emerald-100/50">
               Withdraw Funds
             </button>
           </div>
        </section>

        {/* Config / Bank details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between group cursor-pointer hover:border-emerald-300 transition">
              <div className="flex items-center gap-4">
                 <div className="flex h-12 w-12 rounded-full bg-blue-50 text-blue-600 items-center justify-center">
                   <Building2 className="h-6 w-6" />
                 </div>
                 <div>
                   <h4 className="font-bold text-sm text-foreground">ICICI Bank •••• 4011</h4>
                   <p className="text-xs text-emerald-600 font-bold mt-1 inline-flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Verified Primary</p>
                 </div>
              </div>
              <button className="text-xs font-bold text-muted-foreground group-hover:text-emerald-600">Change</button>
           </div>

           <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition">
               <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                 <LinkIcon className="h-5 w-5" /> Add New Bank Account
               </div>
               <p className="text-xs text-emerald-600/70 mt-1">Link another saving or current account</p>
           </div>
        </div>

        {/* Transaction History Mock */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2"><History className="h-4 w-4" /> Recent Transactions</h3>
            <button className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline"><Download className="h-3 w-3" /> Download Statement</button>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden divide-y divide-border">
            {[
              { id: "TXN001", type: "credit", desc: "Job ID #8928 Booking Settlement", date: "Today, 10:30 AM", amount: "+ ₹450" },
              { id: "TXN002", type: "debit", desc: "Withdrawal to ICICI Bank", date: "Yesterday, 02:15 PM", amount: "- ₹2000" },
              { id: "TXN003", type: "credit", desc: "App Installation Bonus (Referral)", date: "Mar 20, 09:00 AM", amount: "+ ₹100" }
            ].map((txn) => (
              <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                 <div className="flex items-center gap-4">
                   <div className={`flex h-10 w-10 items-center justify-center rounded-full ${txn.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                     {txn.type === 'credit' ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-foreground">{txn.desc}</p>
                     <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">{txn.id}</span>
                       <span className="text-xs text-muted-foreground">{txn.date}</span>
                     </div>
                   </div>
                 </div>
                 <div className={`font-black text-right ${txn.type === 'credit' ? 'text-emerald-600' : 'text-foreground'}`}>
                   {txn.amount}
                 </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <ProviderBottomNav />
    </div>
  );
};
import { CheckCircle } from "lucide-react";

export default ProviderWallet;
