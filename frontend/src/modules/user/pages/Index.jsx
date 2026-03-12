import { motion } from "framer-motion";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";
import EmergencyButton from "@/modules/user/components/EmergencyButton";
import SearchBar from "@/modules/user/components/SearchBar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CategoryGrid from "@/modules/user/components/CategoryGrid";
import ServiceCard from "@/modules/user/components/ServiceCard";

const defaultFeatured = [
  { id: "PRO-1", name: "CoolTech Services", category: "AC Repair", rating: 4.6, reviews: 189, distance: "2.5 km", price: "349", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop", verified: true, emergency: true },
  { id: "PRO-2", name: "Royal Men's Salon", category: "Salon", rating: 4.8, reviews: 312, distance: "1.2 km", price: "199", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop", verified: true, emergency: false },
];

const Index = () => {
  const navigate = useNavigate();
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/shops?search=${encodeURIComponent(query)}`);
    }
  };
  
  const savedProviders = JSON.parse(localStorage.getItem("rozsewa_providers") || "[]");
  const featuredProviders = savedProviders.length > 0 ? savedProviders
    .filter(p => p.status === "approved")
    .map(p => ({
      id: p.id,
      name: p.shopName,
      category: p.category,
      rating: p.rating || 4.5,
      reviews: p.jobs || 0,
      distance: "1.5 km",
      price: "199",
      image: p.image || `https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop`,
      verified: true
    })).slice(0, 4) : defaultFeatured;

  const settings = JSON.parse(localStorage.getItem("rozsewa_platform_settings") || "{}");
  const isEmergencyEnabled = settings.emergencyEnabled !== false; // Default to true if not set

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-6xl px-4 py-6 space-y-8">
        {/* Emergency Button - Dynamic based on Admin Setting */}
        {isEmergencyEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <EmergencyButton />
          </motion.div>
        )}

        {/* Search */}
        <SearchBar onSearch={handleSearch} />

        {/* Categories */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              {showAllCategories ? "All Services" : "Popular Services"}
            </h2>
            <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {showAllCategories ? "Show Less" : "View All"}
            </button>
          </div>
          <CategoryGrid showAll={showAllCategories} />
        </section>

        {/* Featured Providers */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Top Rated Near You</h2>
            <Link to="/shops" className="text-xs font-semibold text-primary hover:underline">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featuredProviders.map((p) => (
              <ServiceCard key={p.id} {...p} />
            ))}
          </div>
        </section>

        {/* Offers Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-emerald-500 p-6 text-primary-foreground shadow-xl"
        >
          <h3 className="text-xl font-extrabold">🎉 Flat 30% OFF on First Booking!</h3>
          <p className="mt-1 text-sm opacity-90">Use code <span className="font-bold">ROJSEWA30</span> at checkout</p>
          <button className="mt-3 rounded-full bg-secondary px-5 py-2 text-sm font-bold text-secondary-foreground shadow transition-transform hover:scale-105 active:scale-95">
            Book Now
          </button>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
