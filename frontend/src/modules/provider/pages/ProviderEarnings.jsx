import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import EarningsWidget from "@/modules/provider/components/EarningsWidget";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ProviderEarnings = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    setIsExporting(true);
    // Simulate API delay for export generation
    setTimeout(() => {
      setIsExporting(false);
      
      // Create a dummy CSV/JSON blob for download demonstration
      const dummyData = JSON.stringify([{ date: "2026-03-10", type: "Settlement", amount: 1250, status: "Completed" }]);
      const blob = new Blob([dummyData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `rozsewa-earnings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Your earnings report has been downloaded.",
      });
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      <ProviderTopNav />
      <main className="container max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Wallet & Earnings</h1>
            <p className="text-sm text-muted-foreground">Track your revenue and withdraw funds.</p>
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm hover:bg-muted transition disabled:opacity-70"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} 
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
        
        <EarningsWidget />

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-bold tracking-tight text-foreground">Recent Transactions</h3>
          <div className="mt-4 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <p className="text-sm">No transactions to display yet.</p>
          </div>
        </div>
      </main>
      <ProviderBottomNav />
    </div>
  );
};

export default ProviderEarnings;
