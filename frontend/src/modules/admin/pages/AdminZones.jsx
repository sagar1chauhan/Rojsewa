import AdminLayout from "@/modules/admin/components/AdminLayout";
import { MapPin, Plus, Move } from "lucide-react";

const AdminZones = () => {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-black text-foreground">City & Zone Management</h1>
                        <p className="text-sm text-muted-foreground mt-1">Configure operational perimeters and geo-fenced boundaries.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 transition"><Plus className="h-4 w-4"/> Add New Zone</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-border bg-white shadow-sm p-6 flex flex-col items-center justify-center text-center h-64 relative overflow-hidden group border-dashed">
                        <div className="absolute inset-0 bg-emerald-50/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="font-bold text-emerald-700 bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2"><Move className="h-4 w-4"/> Click to Map Geofence</span>
                        </div>
                        <MapPin className="h-10 w-10 text-emerald-200 mb-3" />
                        <h3 className="font-black text-lg text-gray-600">Visual Map Disabled</h3>
                        <p className="text-xs text-gray-400 w-2/3">Map rendering layer will load the existing operational zones bounding boxes here.</p>
                    </div>

                    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border bg-gray-50/50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Active Service Zones</h3>
                        </div>
                        <div className="divide-y divide-border">
                            {[
                                { name: "South Delhi Hub", type: "Tier 1 Metro", activeP: 145 },
                                { name: "Noida CBD", type: "Tier 1 Metro", activeP: 89 },
                                { name: "Gurugram Cyber City", type: "Tier 1 Premium", activeP: 210 },
                            ].map((zone, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900">{zone.name}</h4>
                                            <p className="text-xs text-emerald-600 font-bold">{zone.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900">{zone.activeP}</p>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Providers</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminZones;
