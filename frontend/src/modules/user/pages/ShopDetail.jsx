import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, BadgeCheck, MapPin, Phone, MessageCircle, Plus, Minus, ShoppingCart, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";
import { useToast } from "@/components/ui/use-toast";

const defaultProviderFallback = {
  id: "default",
  name: "RojSewa Service",
  category: "General",
  rating: 4.5,
  reviews: 120,
  verified: true,
  address: "Lucknow, India",
  phone: "+91 9999999999",
  price: "299",
  image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=400&fit=crop"
};

// categoryData is now handled dynamically inside the component

const ShopDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState("services");
  const [cart, setCart] = useState({});
  const [showCartWarning, setShowCartWarning] = useState(false);
  const { toast } = useToast();

  const handleCall = () => {
    toast({ title: "Connecting Call", description: `Dialing ${shopData.phone}...` });
    window.location.href = `tel:${shopData.phone}`;
  };

  const handleChat = () => {
    toast({ title: "Opening Chat", description: "Connecting to provider on WhatsApp..." });
    window.location.href = `https://wa.me/${shopData.phone.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in your services on RozSewa.`;
  };

  const savedProviders = JSON.parse(localStorage.getItem("rozsewa_providers") || "[]");
  const foundProvider = savedProviders.find(p => p.id === id);
  
  const provider = foundProvider ? {
    id: foundProvider.id,
    name: foundProvider.shopName,
    category: foundProvider.category,
    rating: foundProvider.rating || 4.5,
    reviews: foundProvider.jobs || 0,
    verified: foundProvider.status === "approved",
    address: foundProvider.location + ", Lucknow",
    phone: foundProvider.mobile || "+91 0000000000",
    price: "199",
    image: foundProvider.image || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=400&fit=crop"
  } : defaultProviderFallback;

  const adminServices = JSON.parse(localStorage.getItem("rozsewa_admin_services") || "[]");
  const adminProducts = JSON.parse(localStorage.getItem("rozsewa_admin_products") || "[]");

  const filteredServices = adminServices
    .filter(s => s.category.toLowerCase() === provider.category.toLowerCase() && s.isVisible)
    .map(s => ({ 
      id: s.id, 
      name: s.name, 
      price: parseInt(s.price) || 299, 
      duration: s.time || "45 min" 
    }));

  const filteredProducts = adminProducts
    .filter(p => p.category.toLowerCase() === provider.category.toLowerCase() && p.isVisible)
    .map(p => ({
      id: p.id,
      name: p.name,
      price: parseInt(p.price) || 499
    }));

  const shopData = {
    ...provider,
    banner: provider.image,
    services: filteredServices.length > 0 ? filteredServices : [
      { id: "s1", name: `${provider.category} Standard Service`, price: 299, duration: "1 hr" },
      { id: "s2", name: `${provider.category} Premium Service`, price: 599, duration: "2 hrs" }
    ],
    products: filteredProducts.length > 0 ? filteredProducts : [
      { id: "p1", name: `${provider.category} Essential Kit`, price: 499 }
    ],
  };

  const addToCart = (itemId) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) newCart[itemId]--;
      else delete newCart[itemId];
      return newCart;
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const service = shopData.services.find((s) => s.id === id);
    const product = shopData.products.find((p) => p.id === id);
    return sum + (service?.price || product?.price || 0) * qty;
  }, 0);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-4xl px-4 py-6 space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl">
          <img src={shopData.banner} alt={shopData.name} className="h-48 w-full object-cover sm:h-64" />
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full glass">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Shop Info */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-foreground">{shopData.name}</h1>
                {shopData.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
              </div>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-secondary text-secondary" /> {shopData.rating} ({shopData.reviews})</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {shopData.address}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleCall}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors active:scale-90"
              >
                <Phone className="h-4 w-4 text-primary" />
              </button>
              <button 
                onClick={handleChat}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors active:scale-90"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-muted p-1">
          {["services", "products"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-all ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-3">
          {(tab === "services" ? shopData.services : shopData.products).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <div>
                <h4 className="text-sm font-bold text-card-foreground">{item.name}</h4>
                {item.duration && <p className="text-xs text-muted-foreground">{item.duration}</p>}
                <p className="mt-1 text-sm font-bold text-primary">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                {cart[item.id] ? (
                  <div className="flex items-center gap-2 rounded-full border border-primary bg-accent px-2 py-1">
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeFromCart(item.id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                      <Minus className="h-3.5 w-3.5 text-primary" />
                    </motion.button>
                    <span className="w-5 text-center text-sm font-bold text-foreground">{cart[item.id]}</span>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => addToCart(item.id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Plus className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(item.id)}
                    className="rounded-full border-2 border-primary px-5 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    ADD
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Cart Bar */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-16 left-0 right-0 z-40 p-4 md:bottom-0"
          >
            <motion.button
              onClick={() => {
                // Save cart data for checkout
                const cartItemsList = Object.entries(cart).map(([itemId, qty]) => {
                  const service = shopData.services.find((s) => s.id === itemId);
                  const product = shopData.products.find((p) => p.id === itemId);
                  return { ...(service || product), qty };
                });
                localStorage.setItem("rozsewa_checkout_data", JSON.stringify({
                  shopName: shopData.name,
                  category: shopData.category,
                  items: cartItemsList,
                  total: cartTotal
                }));
                navigate("/checkout");
              }}
              className="flex w-full items-center justify-between rounded-2xl bg-primary px-6 py-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground">{cartCount} items</span>
              </div>
              <span className="text-lg font-extrabold text-primary-foreground">₹{cartTotal} →</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Warning Modal */}
      <AnimatePresence>
        {showCartWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 md:items-center"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                  <AlertTriangle className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">Replace Cart?</h3>
                  <p className="text-sm text-muted-foreground">Clear previous shop's cart to add this service?</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCartWarning(false)} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted">
                  Cancel
                </button>
                <button onClick={() => { setCart({}); setShowCartWarning(false); }} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
                  Clear & Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default ShopDetail;
