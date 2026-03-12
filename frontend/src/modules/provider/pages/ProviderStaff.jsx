import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import { UserPlus, MoreVertical, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProviderStaff = () => {
  const [staff, setStaff] = useState([
    { id: 1, name: "Rahul Verma", role: "Sr. Stylist", status: "Active" },
    { id: 2, name: "Amit Kumar", role: "Junior Barber", status: "On Leave" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", role: "" });

  const handleAddStaff = (e) => {
    e.preventDefault();
    if(newStaff.name && newStaff.role) {
      setStaff([...staff, { id: Date.now(), name: newStaff.name, role: newStaff.role, status: "Active" }]);
      setIsModalOpen(false);
      setNewStaff({ name: "", role: "" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      <ProviderTopNav />
      <main className="container max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Staff Management</h1>
            <p className="text-sm text-muted-foreground">Manage your workers and assign them to bookings.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-emerald-700 transition"
          >
            <UserPlus className="h-4 w-4" /> Add Staff
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map(member => (
            <div key={member.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <span className="font-bold">{member.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{member.name}</h3>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Staff Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-3xl border border-border bg-card shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-border p-4">
                  <h3 className="text-lg font-bold">Add New Worker</h3>
                  <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 hover:bg-muted">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleAddStaff} className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Worker Name</label>
                    <input 
                      type="text" required 
                      className="mt-1 w-full rounded-xl border border-border bg-background p-3 focus:border-emerald-500 focus:outline-none"
                      placeholder="Enter name"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role / Expertise</label>
                    <input 
                      type="text" required 
                      className="mt-1 w-full rounded-xl border border-border bg-background p-3 focus:border-emerald-500 focus:outline-none"
                      placeholder="e.g. Electrician, Barber"
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="w-full rounded-xl bg-emerald-600 p-3 font-bold text-white hover:bg-emerald-700 transition">
                    Save Worker
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      <ProviderBottomNav />
    </div>
  );
};

export default ProviderStaff;
