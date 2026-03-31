import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const initialServices = [
  { id: "SRV-1", name: "AC Repair & Gas Refill", category: "Home Appliances", providers: 42, isVisible: true, price: 599, time: "90 min", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80", serviceType: "home" },
  { id: "SRV-2", name: "Men's Haircut + Beard", category: "Salon", providers: 89, isVisible: true, price: 299, time: "45 min", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80", serviceType: "home" },
  { id: "SRV-3", name: "Tap Fix", category: "Plumbing", providers: 24, isVisible: true, price: 199, time: "30 min", image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80", serviceType: "24x7" },
  { id: "SRV-4", name: "Full Home Deep Cleaning", category: "Cleaning", providers: 15, isVisible: false, price: 1999, time: "4 hrs", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80", serviceType: "both" },
  { id: "SRV-5", name: "Switch & Socket Repair", category: "Electrician", providers: 56, isVisible: true, price: 149, time: "20 min", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80", serviceType: "24x7" },
];

const initialProducts = [
  { id: "PRD-1", name: "Salon Professional Kit", category: "Salon", price: 999, isVisible: true, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" },
  { id: "PRD-2", name: "AC Filter Cleaner", category: "AC Repair", price: 249, isVisible: true, image: "https://images.unsplash.com/photo-1585671962215-67375a02eeb4?w=800&q=80" },
];

const initialCategories = ["Salon", "AC Repair", "Plumbing", "Cleaning", "Electrician", "Medical", "Painter", "Mechanic", "Pandit"];

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
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [newItem, setNewItem] = useState({ 
    name: "", 
    category: "Salon", 
    price: "", 
    time: "",
    image: "",
    serviceType: "home"
  });

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
    localStorage.setItem("rozsewa_admin_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("rozsewa_admin_categories", JSON.stringify(categories));
  }, [categories]);

  const toggleVisibility = (id, type) => {
    if (type === 'service') {
      setServices(services.map(s => {
        if(s.id === id) {
           toast({ title: "Visibility Updated", description: `${s.name} visibility changed.` });
           return { ...s, isVisible: !s.isVisible };
        }
        return s;
      }));
    } else {
      setProducts(products.map(p => {
        if(p.id === id) {
           toast({ title: "Visibility Updated", description: `${p.name} visibility changed.` });
           return { ...p, isVisible: !p.isVisible };
        }
        return p;
      }));
    }
  };

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
        setServices([{ ...newItem, id: `SRV-${Date.now()}`, providers: 0, isVisible: true }, ...services]);
        toast({ title: "Service Added" });
      }
    } else {
      if (editingItem) {
        setProducts(products.map(p => p.id === editingItem.id ? { ...p, ...newItem } : p));
        toast({ title: "Product Updated" });
      } else {
        setProducts([{ ...newItem, id: `PRD-${Date.now()}`, isVisible: true }, ...products]);
        toast({ title: "Product Added" });
      }
    }
    
    setNewItem({ name: "", category: categories[0], price: "", time: "", image: "", serviceType: "home" });
    setEditingItem(null);
    setShowModal(false);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setNewItem({ 
      name: item.name, 
      category: item.category, 
      price: item.price, 
      time: item.time || "",
      image: item.image || "",
      serviceType: item.serviceType || "home"
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setNewItem({ name: "", category: categories[0], price: "", time: "", image: "", serviceType: "home" });
    setShowModal(true);
  };

  const deleteItem = (id, type) => {
    if (type === 'service') {
      setServices(services.filter(s => s.id !== id));
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
    toast({ title: "Item Removed" });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;
    if (categories.includes(newCatName)) {
      toast({ title: "Duplicate", description: "Category already exists.", variant: "destructive" });
      return;
    }
    setCategories([...categories, newCatName]);
    setNewCatName("");
    setShowCatModal(false);
    toast({ title: "Category Created" });
  };

  const deleteCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
    toast({ title: "Category Removed" });
  };

  const filteredItems = (activeTab === "services" ? services : products).filter(s => {
    const name = s?.name || "";
    const category = s?.category || "";
    const search = (searchTerm || "").toLowerCase();
    
    return name.toLowerCase().includes(search) || 
           category.toLowerCase().includes(search);
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      
      {/* Header Options */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Services & Products</h2>
          <p className="mt-1 text-sm text-gray-500">Manage what users see in shops.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => setShowCatModal(true)} className="flex-1 sm:flex-none flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-extrabold text-gray-700 hover:bg-gray-50 transition-colors justify-center">
            <Plus className="h-4 w-4" /> Categories
          </button>
          <button onClick={openAddModal} className="flex-1 sm:flex-none flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors justify-center">
            <Plus className="h-4 w-4" /> Add {activeTab === "services" ? "Service" : "Product"}
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-gray-200 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab("services")}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "services" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Services
        </button>
        <button 
          onClick={() => setActiveTab("products")}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "products" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Products
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
           <Search className="h-4 w-4 text-gray-400" />
         </div>
         <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm" placeholder={`Search ${activeTab}...`} />
      </div>

      {/* List Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 font-bold">Name</th>
                <th className="py-4 px-6 font-bold">Category</th>
                <th className="py-4 px-6 font-bold">Price</th>
                {activeTab === "services" && <th className="py-4 px-6 font-bold">Estimated Time</th>}
                <th className="py-4 px-6 font-bold text-center">Visibility</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500 font-medium">Nothing found.</td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <motion.tr key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`hover:bg-gray-50/50 transition-colors ${!item.isVisible ? 'bg-gray-50/50 grayscale-[50%]' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={item.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&h=100&fit=crop"} alt={item.name} className="h-10 w-10 shrink-0 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100 uppercase tracking-widest block w-fit mb-1">{item.category}</span>
                      {item.serviceType && (
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border uppercase tracking-widest ${
                          item.serviceType === '24x7' ? 'bg-red-50 text-red-600 border-red-200' :
                          item.serviceType === 'both' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                          'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                          {item.serviceType}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                       <span className="font-extrabold text-emerald-600">₹{item.price}</span>
                    </td>
                    {activeTab === "services" && (
                      <td className="py-4 px-6 text-gray-500 font-medium">{item.time || "N/A"}</td>
                    )}
                    <td className="py-4 px-6 text-center">
                       <button onClick={() => toggleVisibility(item.id, activeTab === "services" ? "service" : "product")} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize transition-colors border ${item.isVisible ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-gray-700'}`}>
                         {item.isVisible ? <><Eye className="h-3.5 w-3.5" /> Visible</> : <><EyeOff className="h-3.5 w-3.5" /> Hidden</>}
                       </button>
                    </td>
                    <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(item)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => deleteItem(item.id, activeTab === "services" ? "service" : "product")} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Modal */}
      <AnimatePresence>
        {showModal && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-200">
                <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-emerald-900">
                    {editingItem ? "Edit" : "Add"} {activeTab === "services" ? "Service" : "Product"}
                  </h3>
                </div>
                
                <form onSubmit={handleAddItem} className="p-6 space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Name</label>
                     <input type="text" placeholder="e.g. AC Cleaning" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Image URL</label>
                     <input type="text" placeholder="https://..." value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Price (₹)</label>
                       <input type="number" placeholder="299" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    {activeTab === "services" && (
                      <div>
                         <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Time</label>
                         <input type="text" placeholder="45 min" value={newItem.time} onChange={e => setNewItem({...newItem, time: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Category</label>
                        <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                           {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Service Type</label>
                        <select value={newItem.serviceType || "home"} onChange={e => setNewItem({...newItem, serviceType: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                           <option value="home">Home Service</option>
                           <option value="24x7">24x7 Emergency</option>
                           <option value="both">Both</option>
                        </select>
                     </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                     <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                     <button type="submit" className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors">
                       Save
                     </button>
                  </div>
                </form>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {showCatModal && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-gray-900">Manage Categories</h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                    {categories.map(c => (
                      <span key={c} className="flex items-center gap-1 rounded-full bg-blue-50 pl-3 pr-2 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                        {c}
                        <button onClick={() => deleteCategory(c)} className="p-0.5 hover:bg-blue-200 rounded-full transition-colors"><Trash2 className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddCategory} className="pt-4 border-t border-gray-100 space-y-3">
                     <label className="block text-xs font-bold text-gray-700 uppercase">New Category Name</label>
                     <input type="text" placeholder="e.g. Decorator" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                     <div className="flex gap-2">
                        <button type="button" onClick={() => setShowCatModal(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold hover:bg-gray-50">Close</button>
                        <button type="submit" className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700">Add</button>
                     </div>
                  </form>
                </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminServices;
