import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Filter, Edit, Trash2, Eye, EyeOff, Settings2, Box, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const initialServices = [
  { id: "SRV-1", name: "AC Repair & Gas Refill", category: "Home Appliances", providers: 42, isVisible: true, price: 599, time: "90 min", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80", serviceType: "home", addOns: [] },
  { id: "SRV-2", name: "Men's Haircut + Beard", category: "Salon", providers: 89, isVisible: true, price: 299, time: "45 min", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80", serviceType: "home", addOns: [] },
];

const initialCategories = ["Salon", "Tailoring & Embroidery", "AC Repair", "Plumbing", "Cleaning", "Electrician", "Medical", "Painter", "Mechanic"];

const AdminServices = () => {
  const { setTitle } = useOutletContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("services"); // services or products
  
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem("rozsewa_admin_services");
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("rozsewa_admin_products");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeServiceForAddOn, setActiveServiceForAddOn] = useState(null);
  
  const [newItem, setNewItem] = useState({ 
    name: "", 
    category: "Salon", 
    price: "", 
    time: "",
    image: "",
    serviceType: "home",
    addOns: []
  });

  const [newAddOn, setNewAddOn] = useState({ name: "", price: "" });
  const [newCatName, setNewCatName] = useState("");

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("rozsewa_admin_categories");
    return saved ? JSON.parse(saved) : initialCategories;
  });

  useEffect(() => {
    setTitle("Manage Services");
  }, [setTitle]);

  useEffect(() => {
    localStorage.setItem("rozsewa_admin_services", JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem("rozsewa_admin_categories", JSON.stringify(categories));
  }, [categories]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      toast({ title: "Missing Fields", description: "Name and Price are required.", variant: "destructive" });
      return;
    }

    if (activeTab === "services") {
      if (editingItem) {
        setServices(services.map(s => s.id === editingItem.id ? { ...s, ...newItem } : s));
        toast({ title: "Service Updated" });
      } else {
        setServices([{ ...newItem, id: `SRV-${Date.now()}`, providers: 0, isVisible: true, addOns: [] }, ...services]);
        toast({ title: "Service Added" });
      }
    } else {
      setProducts([{ ...newItem, id: `PRD-${Date.now()}`, isVisible: true }, ...products]);
    }
    
    setNewItem({ name: "", category: categories[0], price: "", time: "", image: "", serviceType: "home", addOns: [] });
    setEditingItem(null);
    setShowModal(false);
  };

  const handleAddAddOn = (e) => {
    e.preventDefault();
    if (!newAddOn.name || !newAddOn.price) return;
    
    setServices(services.map(s => {
      if (s.id === activeServiceForAddOn.id) {
        const updatedAddOns = [...(s.addOns || []), { id: `ADD-${Date.now()}`, ...newAddOn }];
        return { ...s, addOns: updatedAddOns };
      }
      return s;
    }));

    setNewAddOn({ name: "", price: "" });
    toast({ title: "Add-On Added", description: "New style/accessory added to this service." });
  };

  const removeAddOn = (serviceId, addOnId) => {
    setServices(services.map(s => {
      if (s.id === serviceId) {
        return { ...s, addOns: (s.addOns || []).filter(a => a.id !== addOnId) };
      }
      return s;
    }));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Service Customization</h1>
          <p className="text-sm text-gray-500">Add dynamic styles like "Embroidery", "Lace", or "Buttons" to services.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-5 py-3 bg-emerald-600 text-white rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
          <Plus className="h-5 w-5" /> Create Master Service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map(service => (
          <div key={service.id} className="p-6 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-4">
                 <img src={service.image} className="w-20 h-20 rounded-2xl object-cover border border-gray-100" />
                 <div>
                    <h3 className="text-lg font-black text-gray-900">{service.name}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{service.category}</p>
                    <p className="text-sm font-black text-emerald-600 mt-2">Base Price: ₹{service.price}</p>
                 </div>
              </div>
              
              <div className="flex-1 md:border-l border-dashed border-gray-200 md:pl-6">
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-tighter flex items-center gap-2"><Layers className="h-4 w-4" /> Available Add-On Styles</h4>
                    <button 
                      onClick={() => { setActiveServiceForAddOn(service); setShowAddOnModal(true); }}
                      className="text-[10px] font-black underline text-blue-600 hover:text-blue-800"
                    >
                      + Add Dynamic Style
                    </button>
                 </div>
                 <div className="flex gap-2 flex-wrap">
                    {(service.addOns || []).length === 0 ? (
                      <p className="text-xs text-gray-300 italic">No add-ons yet (e.g. Add Embroidery, Shoulder Fold, etc.)</p>
                    ) : (
                      service.addOns.map(addon => (
                        <div key={addon.id} className="group relative flex items-center gap-3 bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl">
                           <div className="text-xs font-bold text-gray-700">{addon.name} <span className="text-emerald-600 ml-1">+₹{addon.price}</span></div>
                           <button onClick={() => removeAddOn(service.id, addon.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"><Trash2 className="h-3 w-3"/></button>
                        </div>
                      ))
                    )}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add-Ons */}
      <AnimatePresence>
        {showAddOnModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
             <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><Settings2 className="h-6 w-6 text-emerald-600" /> New Style for {activeServiceForAddOn?.name}</h3>
                <form onSubmit={handleAddAddOn} className="space-y-4">
                   <div>
                      <label className="text-[10px] font-black uppercase text-gray-400">Style Name (e.g. Lace, Embroidery)</label>
                      <input type="text" value={newAddOn.name} onChange={e => setNewAddOn({...newAddOn, name: e.target.value})} className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm" placeholder="Gold Lace Work" />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase text-gray-400">Add-on Price (₹)</label>
                      <input type="number" value={newAddOn.price} onChange={e => setNewAddOn({...newAddOn, price: e.target.value})} className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm" placeholder="150" />
                   </div>
                   <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setShowAddOnModal(false)} className="flex-1 py-3 text-xs font-black text-gray-400 uppercase">Cancel</button>
                      <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-emerald-600/20">Add to List</button>
                   </div>
                </form>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for Master Service Creation */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
                <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
                  <h3 className="text-lg font-black text-emerald-900">Create New Service Item</h3>
                  <button onClick={() => setShowModal(false)} className="text-emerald-900/50 hover:text-emerald-900"><Plus className="h-5 w-5 rotate-45" /></button>
                </div>
                <form onSubmit={handleAddItem} className="p-8 space-y-4">
                  <div>
                     <label className="text-[10px] font-black uppercase text-gray-400">Service Name</label>
                     <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none font-bold text-sm" placeholder="Designer Kurti Stitching" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black uppercase text-gray-400">Base Price</label>
                        <input type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-sm" placeholder="499" />
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase text-gray-400">Category</label>
                        <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-xs uppercase focus:outline-none">
                           {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                  </div>
                  <div>
                     <label className="text-[10px] font-black uppercase text-gray-400">Image URL</label>
                     <input type="text" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-sm" placeholder="https://..." />
                  </div>
                  <div className="pt-4">
                     <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm uppercase shadow-xl shadow-emerald-500/20 active:scale-95 transition">Save Master Service</button>
                  </div>
                </form>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminServices;
