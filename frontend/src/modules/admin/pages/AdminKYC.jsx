import AdminLayout from "@/modules/admin/components/AdminLayout";
import { CheckCircle, XCircle, Search, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const AdminKYC = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [kycRequests, setKycRequests] = useState([
        { id: "VK-001", provider: "Royal Salon", vendorType: "Shop Owner", document: "Aadhaar", no: "XXXX-XXXX-9876", status: "pending", submittedOn: "Today, 10:30 AM" },
        { id: "VK-002", provider: "Rahul Plumber", vendorType: "Service Provider", document: "PAN", no: "ABCDE1234F", status: "pending", submittedOn: "Yesterday, 04:15 PM" },
        { id: "VK-003", provider: "Fresh Foods", vendorType: "Food / Tiffin", document: "Aadhaar", no: "XXXX-XXXX-1122", status: "approved", submittedOn: "Mar 20, 2026" },
    ]);

    const handleAction = (id, action) => {
        setKycRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
        toast({ title: `KYC ${action}`, description: `Vendor ${id} KYC marked as ${action}.` });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-black text-foreground">KYC Verification</h1>
                    <p className="text-sm text-muted-foreground mt-1">Review and approve vendor identification documents.</p>
                </div>

                <div className="flex items-center space-x-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm max-w-md">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by ID or Vendor name..." 
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Req ID</th>
                                    <th className="px-6 py-4 font-bold">Vendor Info</th>
                                    <th className="px-6 py-4 font-bold">Document</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {kycRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{req.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{req.provider}</p>
                                            <p className="text-xs text-gray-500">{req.vendorType}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-emerald-600" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{req.document}</p>
                                                    <p className="text-xs tracking-wider text-gray-500 font-mono">{req.no}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                                                req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                                                req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {req.status}
                                            </span>
                                            <p className="text-[10px] text-gray-500 mt-1 font-medium">{req.submittedOn}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.status === 'pending' ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleAction(req.id, 'approved')} className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition">
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleAction(req.id, 'rejected')} className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition">
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center text-xs font-bold text-gray-400">Processed</div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminKYC;
