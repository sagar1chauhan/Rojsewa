import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, BadgeCheck, MapPin, Phone, MessageCircle, Plus, Minus, ShoppingCart, ShieldCheck, Camera, CheckCircle2, ChevronDown, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";
import { useToast } from "@/components/ui/use-toast";

const ShopDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState("services");
  const [cart, setCart] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState({}); // { planId: [addOnId1, addOnId2] }
  const { toast } = useToast();
  const [expandedPlan, setExpandedPlan] = useState(null);

  const adminServices = JSON.parse(localStorage.getItem("rozsewa_admin_services") || "[]");
  const savedProviders = JSON.parse(localStorage.getItem("rozsewa_providers") || "[]");
  const provider = savedProviders.find(p => p.id === id) || { name: "Tailor Shop", category: "Tailoring & Embroidery", rating: 4.8, reviews: 156, image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=400&fit=crop" };

  const servicesList = adminServices.filter(s => (s.category || "").toLowerCase().includes("tailor") || (s.category || "").toLowerCase() === (provider.category || "").toLowerCase());

  const toggleAddOn = (planId, addOn) => {
    setSelectedAddOns(prev => {
      const current = prev[planId] || [];
      const exists = current.find(a => a.id === addOn.id);
      if (exists) {
        return { ...prev, [planId]: current.filter(a => a.id !== addOn.id) };
      } else {
        return { ...prev, [planId]: [...current, addOn] };
      }
    });
  };

  const getPlanTotal = (planId, basePrice) => {
    const adds = selectedAddOns[planId] || [];
    const addsTotal = adds.reduce((sum, a) => sum + (parseInt(a.price) || 0), 0);
    return basePrice + addsTotal;
  };

  const addToCart = (planId) => { setCart((prev) => ({ ...prev, [planId]: (prev[planId] || 0) + 1 })); };
  const removeFromCart = (planId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[planId] > 1) newCart[planId]--;
      else { delete newCart[planId]; delete selectedAddOns[planId]; }
      return newCart;
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [pId, qty]) => {
    const service = servicesList.find(s => s.id === pId.split('-')[0]);
    const price = parseInt(service?.price) || 0;
    return sum + (getPlanTotal(pId, price) * qty);
  }, 0);

  const handleCheckout = () => {
    const items = Object.entries(cart).map(([pId, qty]) => {
      const service = servicesList.find(s => s.id === pId.split('-')[0]);
      const adds = selectedAddOns[pId] || [];
      const addsNames = adds.map(a => a.name).join(", ");
      return { 
        id: pId, 
        name: service.name + (addsNames ? ` (+ ${addsNames})` : ""), 
        price: getPlanTotal(pId, parseInt(service.price)), 
        qty, 
        duration: service.time || "1 hr" 
      };
    });
    localStorage.setItem("rozsewa_checkout_data", JSON.stringify({ shopName: provider.name, category: provider.category, items, total: cartTotal }));
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <TopNav />
      {/* Hero Header */}
      <div className="relative h-56 sm:h-72 w-full">
        <img src={provider.image} alt={provider.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 text-white p-6 flex flex-col justify-end">
           <h1 className="text-2xl font-black">{provider.name}</h1>
           <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{provider.category}</p>
        </div>
      </div>

      <main className="container max-w-2xl px-4 py-8 space-y-6">
        <div className="flex bg-muted p-1 rounded-2xl">
           <button onClick={() => setTab("services")} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${tab==='services'?'bg-card text-foreground shadow-sm':'text-muted-foreground'}`}>Select Style & Customization</button>
        </div>

        <div className="space-y-4">
           {servicesList.map(service => {
             const planId = `${service.id}-main`;
             const isAdded = !!cart[planId];
             
             return (
               <div key={service.id} className={`rounded-3xl border transition-all ${isAdded ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-border bg-card'}`}>
                  <div className="p-5">
                     <div className="flex gap-4">
                        <img src={service.image} className="h-20 w-20 rounded-2xl object-cover shadow-sm" />
                        <div className="flex-1">
                           <h3 className="text-lg font-black text-foreground leading-tight">{service.name}</h3>
                           <p className="text-sm font-black text-primary mt-1">Starting from ₹{service.price}</p>
                        </div>
                        <div className="shrink-0 flex items-center">
                           {isAdded ? (
                             <div className="flex items-center gap-3 bg-white shadow-sm border border-primary/20 p-1 rounded-xl">
                                <button onClick={() => removeFromCart(planId)} className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center"><Minus className="h-4 w-4 text-primary" /></button>
                                <span className="font-black text-sm">{cart[planId]}</span>
                                <button onClick={() => addToCart(planId)} className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md"><Plus className="h-4 w-4 text-white" /></button>
                             </div>
                           ) : (
                             <button onClick={() => addToCart(planId)} className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase shadow-lg shadow-primary/20 active:scale-95 transition-all">Add to Bag</button>
                           )}
                        </div>
                     </div>

                     {/* Dynamic Add-Ons Section */}
                     {(service.addOns || []).length > 0 && isAdded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-6 pt-5 border-t border-dashed border-primary/20">
                           <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">✨ Customize with Add-on Styles</h4>
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {service.addOns.map(addon => {
                                const isSelected = (selectedAddOns[planId] || []).find(a => a.id === addon.id);
                                return (
                                  <button key={addon.id} onClick={() => toggleAddOn(planId, addon)} className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${isSelected ? 'border-primary bg-primary/10' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                     <div className={`h-8 w-8 rounded-full mb-2 flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {isSelected ? <CheckCircle className="h-5 w-5" /> : <Plus className="h-4 w-4" />}
                                     </div>
                                     <p className="text-[10px] font-black leading-tight text-center">{addon.name}</p>
                                     <p className="text-[9px] font-bold text-emerald-600 mt-1">+₹{addon.price}</p>
                                  </button>
                                );
                              })}
                           </div>
                        </motion.div>
                     )}
                  </div>
                  
                  {isAdded && (
                    <div className="bg-primary/10 px-6 py-3 border-t border-primary/10 flex justify-between items-center rounded-b-3xl">
                       <span className="text-[10px] font-black text-primary uppercase">Current Subtotal</span>
                       <span className="text-sm font-black text-primary">₹{getPlanTotal(planId, parseInt(service.price))}</span>
                    </div>
                  )}
               </div>
             );
           })}
        </div>
      </main>

      {/* Cart Float */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-24 left-0 right-0 z-40 p-4 md:bottom-4 flex justify-center pointer-events-none">
            <div className="w-full max-w-2xl pointer-events-auto">
              <motion.button onClick={handleCheckout} className="flex w-full items-center justify-between rounded-3xl bg-gray-900 px-6 py-5 shadow-2xl text-white">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{cartCount} Items in bag</p>
                  <p className="text-xl font-black">₹{cartTotal}</p>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-2xl font-black text-xs uppercase">
                  Proceed to Checkout <ArrowLeft className="h-4 w-4 rotate-180" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
};

export default ShopDetail;
