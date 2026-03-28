import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, Edit, Trash2, Search, MapPin, CheckCircle, 
  XCircle, Clock, Star, AlertTriangle 
} from "lucide-react";

const demoProviders = [
  { id: "PRO-1", shopName: "CoolTech Services", owner: "Ramesh Kumar", category: "AC Repair", mobile: "+91 9876500001", status: "pending", location: "Lucknow", rating: 0, jobs: 0, joined: "2026-03-11", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop" },
  { id: "PRO-2", shopName: "Royal Men's Salon", owner: "Vikas Plumbing", category: "Salon", mobile: "+91 9876500002", status: "approved", location: "Lucknow", rating: 4.8, jobs: 234, joined: "2026-02-15", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop" },
  { id: "PRO-3", shopName: "Quick Fix Plumbers", owner: "Amit Patel", category: "Plumbing", mobile: "+91 9876500003", status: "rejected", location: "Kanpur", rating: 0, jobs: 0, joined: "2026-03-01", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop" },
];

const statusStyles = {
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
};

const AdminProviders = () => {
  const { setTitle } = useOutletContext();
  const { toast } = useToast();
  const [providers, setProviders] = useState(() => {
    const saved = localStorage.getItem("rozsewa_providers");
    return saved ? JSON.parse(saved) : demoProviders;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [newProvider, setNewProvider] = useState({ shopName: "", owner: "", category: "Salon", location: "Lucknow", mobile: "", image: "" });

  const categories = JSON.parse(localStorage.getItem("rozsewa_admin_categories") || '["Salon", "AC Repair", "Plumbing", "Electrician"]');

  useEffect(() => {
    setTitle("Manage Providers");
  }, [setTitle]);

  useEffect(() => {
    localStorage.setItem("rozsewa_providers", JSON.stringify(providers));
  }, [providers]);

  const handleUpdateStatus = (id, newStatus) => {
    setProviders(providers.map(p => {
      if (p.id === id) {
        toast({ title: "Status Updated", description: `${p.shopName} is now ${newStatus}.` });
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  const handleSaveProvider = (e) => {
    e.preventDefault();
    if (!newProvider.shopName || !newProvider.owner) return;

    if (editingProvider) {
      setProviders(providers.map(p => p.id === editingProvider.id ? { ...p, ...newProvider } : p));
      toast({ title: "Shop Updated", description: `${newProvider.shopName} updated.` });
    } else {
      const provider = {
        ...newProvider,
        id: `PRO-${Date.now()}`,
        status: "approved",
        rating: 4.5,
        jobs: 0,
        joined: new Date().toISOString().split("T")[0]
      };
      setProviders([provider, ...providers]);
      toast({ title: "Shop Added", description: `${newProvider.shopName} created.` });
    }
    setShowModal(false);
    setEditingProvider(null);
    setNewProvider({ shopName: "", owner: "", category: "Salon", location: "Lucknow", mobile: "", image: "" });
  };

  const startEdit = (p) => {
    setEditingProvider(p);
    setNewProvider({ shopName: p.shopName, owner: p.owner, category: p.category, location: p.location, mobile: p.mobile, image: p.image || "" });
    setShowModal(true);
  };

  const deleteProvider = (id) => {
    setProviders(providers.filter(p => p.id !== id));
    toast({ title: "Shop Removed", description: "Provider deleted from platform." });
  };

  const filteredProviders = providers.filter(p => {
    const sName = p?.shopName || "";
    const oName = p?.owner || "";
    const pId = p?.id || "";
    const search = (searchTerm || "").toLowerCase();

    const matchesSearch = sName.toLowerCase().includes(search) || 
                          oName.toLowerCase().includes(search) ||
                          pId.toLowerCase().includes(search);
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Service Providers</h2>
          <p className="mt-1 text-sm text-gray-500">Review applications and manage active provider accounts.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex rounded-xl bg-gray-100 p-1 shrink-0">
            {["all", "pending", "approved", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                  filter === f ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="relative flex-1 min-w-[200px] md:min-w-[300px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all"
              placeholder="Search shop, owner, ID..."
            />
          </div>

          <button onClick={() => { setEditingProvider(null); setShowModal(true); }} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:-translate-y-0.5 active:translate-y-0">
            <Plus className="h-4 w-4" /> <span>Add Shop</span>
          </button>
        </div>
      </div>

      {filter === "all" && providers.some(p => p.status === "pending") && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm flex items-start sm:items-center gap-4">
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-900">Action Required</h3>
            <p className="text-xs text-amber-700 font-medium">There are {providers.filter(p => p.status === "pending").length} new provider applications awaiting your review.</p>
          </div>
          <button
            onClick={() => setFilter("pending")}
            className="shrink-0 rounded-xl bg-white border border-amber-200 px-4 py-2 text-xs font-bold text-amber-700 shadow-sm hover:bg-amber-100 transition-colors"
          >
            Review Now
          </button>
        </div>
      )}

      {/* Providers Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="py-4 px-6 font-bold">Shop Info</th>
                <th className="py-4 px-6 font-bold">Category & Details</th>
                <th className="py-4 px-6 font-bold text-center">Performance</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProviders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <p className="text-gray-500 font-medium">No providers found.</p>
                  </td>
                </tr>
              ) : (
                filteredProviders.map((provider) => (
                  <motion.tr key={provider.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 max-w-[250px]">
                      <div className="flex items-center gap-3">
                        <div className={`flex shrink-0 h-12 w-12 items-center justify-center rounded-xl bg-gray-100 border border-gray-100 overflow-hidden`}>
                          {provider.image ? (
                            <img src={provider.image} alt={provider.shopName} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-lg font-black text-emerald-700">{provider.shopName.charAt(0)}</span>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-extrabold text-gray-900 truncate" title={provider.shopName}>{provider.shopName}</p>
                          <p className="text-xs font-semibold text-gray-500 mt-0.5 truncate">{provider.owner}</p>
                          <p className="text-[10px] font-mono text-gray-400 mt-0.5">{provider.id}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100 mb-1.5">
                        {provider.category}
                      </span>
                      <div className="flex flex-col gap-1 text-xs text-gray-600 font-medium">
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gray-400" /> {provider.location}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gray-400" /> Applied: {provider.joined}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center justify-center gap-1 line-clamp-2">
                        {provider.status === "approved" ? (
                          <>
                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-xs font-bold text-gray-900">
                              {provider.rating} <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                            </div>
                            <span className="text-[10px] font-semibold text-gray-500">{provider.jobs} jobs</span>
                          </>
                        ) : (
                          <span className="text-xs italic text-gray-400">- N/A -</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyles[provider.status]}`}>
                        {provider.status === "approved" && <CheckCircle className="h-3.5 w-3.5" />}
                        {provider.status === "pending" && <Clock className="h-3.5 w-3.5" />}
                        {provider.status === "rejected" && <XCircle className="h-3.5 w-3.5" />}
                        {provider.status}
                      </span>
                    </td>

                     <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(provider)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => deleteProvider(provider.id)} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                        
                        {provider.status === "pending" && (
                          <>
                            <button onClick={() => handleUpdateStatus(provider.id, "approved")} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors border border-emerald-200 shadow-sm">
                              <CheckCircle className="h-3.5 w-3.5" /> Approve
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Shop Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
               <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
                  <h3 className="text-lg font-extrabold text-emerald-900">{editingProvider ? "Edit Shop" : "Add New Shop"}</h3>
               </div>
               <form onSubmit={handleSaveProvider} className="p-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                     <label className="text-xs font-bold text-gray-500 uppercase">Shop Name</label>
                     <input type="text" value={newProvider.shopName} onChange={e => setNewProvider({...newProvider, shopName: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Owner Name</label>
                     <input type="text" value={newProvider.owner} onChange={e => setNewProvider({...newProvider, owner: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Mobile</label>
                     <input type="text" value={newProvider.mobile} onChange={e => setNewProvider({...newProvider, mobile: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                     <select value={newProvider.category} onChange={e => setNewProvider({...newProvider, category: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                     <input type="text" value={newProvider.location} onChange={e => setNewProvider({...newProvider, location: e.target.value})} className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm" />
                  </div>
                  <div className="col-span-2">
                     <label className="text-xs font-bold text-gray-500 uppercase">Shop Photo URL</label>
                     <div className="flex gap-2 items-center">
                        <input type="text" placeholder="https://images.unsplash.com/..." value={newProvider.image} onChange={e => setNewProvider({...newProvider, image: e.target.value})} className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm" />
                        <button type="button" onClick={() => setNewProvider({...newProvider, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"})} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">Sample</button>
                     </div>
                  </div>
                  <div className="col-span-2 flex gap-3 pt-4">
                     <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold">Cancel</button>
                     <button type="submit" className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20">Save Shop</button>
                  </div>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProviders;
