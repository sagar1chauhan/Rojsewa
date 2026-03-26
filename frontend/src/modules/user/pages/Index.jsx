import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";
import EmergencyButton from "@/modules/user/components/EmergencyButton";
import SearchBar from "@/modules/user/components/SearchBar";
import CategoryGrid from "@/modules/user/components/CategoryGrid";
import ServiceCard from "@/modules/user/components/ServiceCard";

const defaultFeatured = [
  { id: "PRO-1", name: "CoolTech Services", category: "AC Repair", rating: 4.8, reviews: 189, distance: "2.5 km", price: "349", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80", verified: true, emergency: true },
  { id: "PRO-2", name: "Royal Men's Salon", category: "Salon", rating: 4.9, reviews: 312, distance: "1.2 km", price: "199", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80", verified: true, emergency: false },
  { id: "PRO-3", name: "Sparkle Cleaning", category: "Cleaning", rating: 4.7, reviews: 45, distance: "3.1 km", price: "499", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80", verified: true, emergency: false },
];

const defaultBanners = [
  { id: 1, title: "Summer Mega Sale", subtitle: "Flat 30% OFF on AC Repair", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80", link: "/shops?search=AC", isActive: true },
  { id: 2, title: "Premium Salon at Home", subtitle: "Expert grooming starting ₹199", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80", link: "/shops?category=Salon", isActive: true },
];

const Index = () => {
  const navigate = useNavigate();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const savedBanners = JSON.parse(localStorage.getItem("rozsewa_admin_banners") || "[]");
    const activeBanners = savedBanners.filter(b => b.isActive);
    setBanners(activeBanners.length > 0 ? activeBanners : defaultBanners);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);
  
  const handleSearch = (query) => {
    if (query.trim()) navigate(`/shops?search=${encodeURIComponent(query)}`);
  };
  
  const savedProviders = JSON.parse(localStorage.getItem("rozsewa_providers") || "[]");
  const featuredProviders = savedProviders.length > 0 ? savedProviders
    .filter(p => p.status === "approved" || !p.status)
    .map((p, i) => ({
      id: p.id || `PRO-${i}`,
      name: p.shopName || p.name || "Provider",
      category: p.category || "General",
      rating: parseFloat(p.rating) || 4.5,
      reviews: parseInt(p.jobs) || Math.floor(Math.random() * 100),
      distance: (Math.random() * 5 + 1).toFixed(1) + " km",
      price: "199",
      image: p.image || defaultFeatured[i % 3]?.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
      verified: true,
      emergency: i % 2 === 0
    })).slice(0, 4) : defaultFeatured;

  const settings = JSON.parse(localStorage.getItem("rozsewa_platform_settings") || "{}");
  const isEmergencyEnabled = settings.emergencyEnabled !== false;

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-8">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Dynamic Banners Slider */}
        {banners.length > 0 && (
          <section className="relative h-48 sm:h-64 lg:h-72 w-full overflow-hidden rounded-[32px] bg-muted shadow-2xl group">
            <AnimatePresence mode="wait">
              <motion.div key={currentBanner} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                <img src={banners[currentBanner].image || banners[currentBanner].imageUrl} alt={banners[currentBanner].title} className="h-full w-full object-cover" />
                
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8">
                  <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
                    {banners[currentBanner].title}
                  </motion.h2>
                  <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                    className="text-sm font-semibold text-white/80 mb-4">
                    {banners[currentBanner].subtitle || banners[currentBanner].description}
                  </motion.p>
                  <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                    onClick={() => navigate(banners[currentBanner].link || banners[currentBanner].ctaLink || "/shops")}
                    className="rounded-full bg-white px-6 py-2.5 text-xs font-black uppercase tracking-widest text-black hover:bg-white/90 transition-colors shadow-lg active:scale-95 flex items-center gap-2">
                    {banners[currentBanner].ctaText || "Book Now"} <ArrowRight className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-6 right-6 z-30 flex gap-1.5">
                {banners.map((_, i) => (
                  <button key={i} onClick={() => setCurrentBanner(i)} className={`h-1.5 rounded-full transition-all ${currentBanner === i ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Search */}
        <section className="-mt-4 relative z-40">
           <SearchBar onSearch={handleSearch} />
        </section>

        {isEmergencyEnabled && (
          <section>
            <EmergencyButton />
          </section>
        )}

        {/* Categories Grid */}
        <section className="bg-card border border-border rounded-[32px] p-5 sm:p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground">Explore Categories</h2>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">Find exactly what you need</p>
            </div>
            <button onClick={() => setShowAllCategories(!showAllCategories)} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-full">
              {showAllCategories ? "Show Less" : "View All"} <ChevronRight className={`h-3 w-3 transition-transform ${showAllCategories ? "-rotate-90" : ""}`} />
            </button>
          </div>
          <CategoryGrid showAll={showAllCategories} />
        </section>

        {/* Top Providers */}
        <section>
          <div className="mb-5 flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground">Top Rated Professionals</h2>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">Highly reliable experts near you</p>
            </div>
            <Link to="/shops" className="text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              See All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featuredProviders.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <ServiceCard {...p} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trusted By Banner */}
        <section className="rounded-3xl bg-muted p-8 text-center border border-border border-dashed">
           <h3 className="text-2xl font-black tracking-tight text-foreground">RojSewa Guarantee</h3>
           <p className="text-sm font-medium text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">Every professional is background checked, trained, and equipped to deliver premium service safely at your home.</p>
           <div className="mt-6 flex flex-wrap justify-center gap-4">
             {["100% Genuine", "Secure Payments", "Trained Experts"].map(badge => (
               <div key={badge} className="rounded-full bg-background border border-border px-4 py-2 text-xs font-bold text-foreground flex items-center gap-2 shadow-sm">
                 <div className="h-2 w-2 rounded-full bg-emerald-500" /> {badge}
               </div>
             ))}
           </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
