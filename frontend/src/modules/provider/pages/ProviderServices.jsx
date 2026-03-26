import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Edit3, Trash2, Eye, EyeOff, X, Save, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";
import { useToast } from "@/components/ui/use-toast";

const ProviderServices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState(() => JSON.parse(localStorage.getItem("rozsewa_provider_my_services") || "[]"));
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [form, setForm] = useState({ name: "", description: "", basic: "", standard: "", premium: "", duration: "30 min", visible: true });

  const saveServices = (s) => { setServices(s); localStorage.setItem("rozsewa_provider_my_services", JSON.stringify(s)); };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.basic) { toast({ title: "Name & Basic price required", variant: "destructive" }); return; }
    const entry = { ...form, id: editIdx >= 0 ? services[editIdx].id : `SRV-${Date.now().toString(36)}` };
    let updated;
    if (editIdx >= 0) { updated = [...services]; updated[editIdx] = entry; }
    else updated = [...services, entry];
    saveServices(updated);
    toast({ title: editIdx >= 0 ? "Service Updated" : "Service Added" });
    resetForm();
  };

  const resetForm = () => { setForm({ name: "", description: "", basic: "", standard: "", premium: "", duration: "30 min", visible: true }); setShowForm(false); setEditIdx(-1); };

  const handleEdit = (i) => { setForm(services[i]); setEditIdx(i); setShowForm(true); };

  const handleDelete = (i) => { const updated = services.filter((_, idx) => idx !== i); saveServices(updated); toast({ title: "Service Removed" }); };

  const toggleVisibility = (i) => {
    const updated = [...services]; updated[i] = { ...updated[i], visible: !updated[i].visible }; saveServices(updated);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-3xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-foreground">My Services</h1>
              <p className="text-xs text-muted-foreground">{services.length} services listed</p>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Add Service
          </motion.button>
        </div>

        {/* Service List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-12 text-center">
              <IndianRupee className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">No services added yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add your services with pricing to start receiving bookings</p>
            </div>
          )}
          {services.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border bg-card p-4 transition-all ${s.visible ? "border-border" : "border-border/50 opacity-60"}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-foreground">{s.name}</h3>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => toggleVisibility(i)} className="p-1.5 rounded-lg hover:bg-muted">{s.visible ? <Eye className="h-3.5 w-3.5 text-emerald-500" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}</button>
                  <button onClick={() => handleEdit(i)} className="p-1.5 rounded-lg hover:bg-muted"><Edit3 className="h-3.5 w-3.5 text-blue-500" /></button>
                  <button onClick={() => handleDelete(i)} className="p-1.5 rounded-lg hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-rose-500" /></button>
                </div>
              </div>
              {s.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{s.description}</p>}
              <div className="flex gap-2 flex-wrap">
                <span className="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Basic ₹{s.basic}</span>
                {s.standard && <span className="rounded-lg bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-300">Standard ₹{s.standard}</span>}
                {s.premium && <span className="rounded-lg bg-purple-50 dark:bg-purple-900/30 px-2 py-1 text-[10px] font-bold text-purple-700 dark:text-purple-300">Premium ₹{s.premium}</span>}
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">Duration: {s.duration}</p>
            </motion.div>
          ))}
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card border border-border shadow-2xl">
                <div className="flex items-center justify-between border-b border-border p-4 sticky top-0 bg-card z-10">
                  <h3 className="text-lg font-bold text-foreground">{editIdx >= 0 ? "Edit Service" : "Add Service"}</h3>
                  <button onClick={resetForm} className="rounded-full p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSave} className="p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Service Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. AC Deep Cleaning" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Description</label>
                    <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Describe the service..." />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5">Basic ₹ *</label>
                      <input type="number" value={form.basic} onChange={e => setForm({ ...form, basic: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="299" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5">Standard ₹</label>
                      <input type="number" value={form.standard} onChange={e => setForm({ ...form, standard: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="499" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5">Premium ₹</label>
                      <input type="number" value={form.premium} onChange={e => setForm({ ...form, premium: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="799" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Duration</label>
                    <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                      {["15 min", "30 min", "45 min", "1 hr", "1.5 hrs", "2 hrs", "3 hrs", "4+ hrs"].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-extrabold text-primary-foreground">
                    <Save className="h-4 w-4" /> {editIdx >= 0 ? "Update" : "Add"} Service
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
};

export default ProviderServices;
