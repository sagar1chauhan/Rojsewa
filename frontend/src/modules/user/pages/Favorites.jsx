import { motion } from "framer-motion";
import { ArrowLeft, Heart, Star, MapPin, ChevronRight, MessageCircle, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const favorites = [
  { id: "PRO-1", name: "CoolTech Services", category: "AC Repair", rating: 4.6, reviews: 189, distance: "2.5 km", price: "349", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop", verified: true },
  { id: "PRO-2", name: "Royal Men's Salon", category: "Salon", rating: 4.8, reviews: 312, distance: "1.2 km", price: "199", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop", verified: true },
];

const Favorites = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="text-xl font-bold text-foreground">My Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Heart className="h-10 w-10 text-muted-foreground opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No favorites yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Save your favorite service providers to find them easily here.</p>
            <button onClick={() => navigate("/shops")} className="mt-6 rounded-2xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">Explore Services</button>
          </div>
        ) : (
          <div className="grid gap-4">
            {favorites.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-lg"
              >
                <div className="flex gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-foreground truncate">{p.name}</h3>
                        <p className="text-xs font-bold text-primary">{p.category}</p>
                      </div>
                      <button className="text-rose-500"><Heart className="h-5 w-5 fill-current" /></button>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-secondary text-secondary" /> {p.rating}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.distance}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm font-black text-foreground">Starting ₹{p.price}</p>
                      <button 
                        onClick={() => navigate(`/shop/${p.id}`)}
                        className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Favorites;
