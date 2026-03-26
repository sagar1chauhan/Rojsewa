import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Image, ToggleLeft, ToggleRight, Trash2, Edit3, X, Save, Link2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from "../components/AdminLayout";

const AdminBanners = () => {
  const { toast } = useToast();
  const [banners, setBanners] = useState(() => JSON.parse(localStorage.getItem("rozsewa_admin_banners") || "[]"));
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", ctaLink: "/shops", ctaText: "Book Now", active: true });

  const saveBanners = (b) => { setBanners(b); localStorage.setItem("rozsewa_admin_banners", JSON.stringify(b)); };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title) { toast({ title: "Title is required", variant: "destructive" }); return; }
    const entry = { ...form, id: editIdx >= 0 ? banners[editIdx].id : `BNR-${Date.now().toString(36)}`, updatedAt: new Date().toISOString() };
    let updated;
    if (editIdx >= 0) { updated = [...banners]; updated[editIdx] = entry; }
    else updated = [...banners, entry];
    saveBanners(updated);
    toast({ title: editIdx >= 0 ? "Banner Updated" : "Banner Created" });
    resetForm();
  };

  const resetForm = () => { setForm({ title: "", description: "", imageUrl: "", ctaLink: "/shops", ctaText: "Book Now", active: true }); setShowForm(false); setEditIdx(-1); };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "Image too large", description: "Please select an image under 2MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (i) => { setForm(banners[i]); setEditIdx(i); setShowForm(true); };
  const handleDelete = (i) => { saveBanners(banners.filter((_, idx) => idx !== i)); toast({ title: "Banner Deleted" }); };
  const toggleActive = (i) => { const updated = [...banners]; updated[i] = { ...updated[i], active: !updated[i].active }; saveBanners(updated); };

  return (
    <AdminLayout title="Banners">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Banner Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage homepage promotional banners</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg">
          <Plus className="h-4 w-4" /> Add Banner
        </motion.button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-16 text-center rounded-2xl border-2 border-dashed border-border">
            <Image className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">No banners yet</p>
          </div>
        )}
        {banners.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`rounded-2xl border bg-card overflow-hidden transition-all ${b.active ? "border-border" : "border-border/50 opacity-60"}`}>
            {b.imageUrl ? (
              <div className="h-32 bg-muted overflow-hidden">
                <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
              </div>
            ) : (
              <div className="h-32 bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
                <Image className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-foreground truncate">{b.title}</h3>
                <button onClick={() => toggleActive(i)}>
                  {b.active ? <ToggleRight className="h-5 w-5 text-emerald-500" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
              {b.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{b.description}</p>}
              <div className="flex gap-2">
                <button onClick={() => handleEdit(i)} className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-muted py-2 text-xs font-bold text-foreground hover:bg-muted/80">
                  <Edit3 className="h-3 w-3" /> Edit
                </button>
                <button onClick={() => handleDelete(i)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card border border-border shadow-2xl">
              <div className="flex items-center justify-between border-b border-border p-4 sticky top-0 bg-card z-10">
                <h3 className="text-lg font-bold text-foreground">{editIdx >= 0 ? "Edit Banner" : "New Banner"}</h3>
                <button onClick={resetForm} className="rounded-full p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleSave} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Summer Sale!" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Description</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Get 50% off on all cleaning services..." />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Banner Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full rounded-xl border border-border bg-background p-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer text-muted-foreground" 
                  />
                  {form.imageUrl && form.imageUrl.startsWith("data:image") && (
                     <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <Image className="h-3 w-3" /> Image successfully uploaded
                     </div>
                  )}
                  {form.imageUrl && !form.imageUrl.startsWith("data:image") && (
                     <div className="mt-2 text-xs text-blue-600 font-bold flex items-center gap-1">
                        <Image className="h-3 w-3" /> External image active
                     </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">CTA Text</label>
                    <input value={form.ctaText} onChange={e => setForm({ ...form, ctaText: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">CTA Link</label>
                    <input value={form.ctaLink} onChange={e => setForm({ ...form, ctaLink: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-extrabold text-primary-foreground">
                  <Save className="h-4 w-4" /> {editIdx >= 0 ? "Update" : "Create"} Banner
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </AdminLayout>
  );
};

export default AdminBanners;
