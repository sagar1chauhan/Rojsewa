import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import EarningsWidget from "@/modules/provider/components/EarningsWidget";
import RecentBookingsList from "@/modules/provider/components/RecentBookingsList";

const ProviderDashboard = () => {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      <ProviderTopNav />
      
      <main className="container max-w-6xl px-4 py-8 space-y-10">
        <section>
          <div className="mb-4">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Welcome back, Royal Salon 👋</h1>
            <p className="text-sm text-muted-foreground">Here is what is happening with your business today.</p>
          </div>
          <EarningsWidget />
        </section>

        <section>
          <RecentBookingsList />
        </section>
      </main>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderDashboard;
