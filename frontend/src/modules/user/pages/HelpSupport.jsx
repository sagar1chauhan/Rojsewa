import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageSquare, Phone, Mail, HelpCircle, ChevronRight, Search, Zap, ExternalLink, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";

const faqs = [
  "How to cancel my booking?",
  "What is RozSewa Safety policy?",
  "How can I apply a coupon?",
  "Refund not received in bank.",
  "How to contact my service professional?",
];

const HelpSupport = () => {
  const navigate = useNavigate();
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const policies = JSON.parse(localStorage.getItem("rozsewa_policy_settings") || JSON.stringify({
    terms: "Welcome to RozSewa. By using our services, you agree to our terms...",
    privacy: "Your privacy is important to us. We collect data to improve your experience...",
    cancellation: "Cancellations made 24 hours before the service are fully refundable..."
  }));

  const legalLinks = [
    { label: "Terms of Service", content: policies.terms },
    { label: "Privacy Policy", content: policies.privacy },
    { label: "Cancellation & Refund", content: policies.cancellation },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-8">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="text-xl font-bold text-foreground">Help & Support</h1>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-3 gap-3">
           {[
             { label: "WhatsApp Chat", icon: MessageSquare, color: "bg-emerald-100 text-emerald-600" },
             { label: "Phone Call", icon: Phone, color: "bg-blue-100 text-blue-600" },
             { label: "Email Support", icon: Mail, color: "bg-rose-100 text-rose-600" },
           ].map((opt) => (
             <motion.button key={opt.label} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-3 rounded-[24px] border border-border bg-card p-4 transition-all hover:bg-muted/50">
               <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${opt.color}`}>
                 <opt.icon className="h-6 w-6" />
               </div>
               <span className="text-[11px] font-black text-foreground text-center line-clamp-2">{opt.label}</span>
             </motion.button>
           ))}
        </div>

        {/* FAQ Search */}
        <div className="space-y-4">
           <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest px-2">Common Issues</h3>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search for help topics..."
                className="w-full rounded-2xl border border-border bg-muted/30 py-4 pl-12 pr-4 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
           </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-2">
           {faqs.map((q) => (
             <motion.button
               key={q}
               whileTap={{ scale: 0.98 }}
               className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left hover:bg-muted/50"
             >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-4 w-4 text-primary opacity-60" />
                  <span className="text-sm font-bold text-foreground">{q}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-30" />
             </motion.button>
           ))}
        </div>

        {/* Legal Links */}
        <div className="space-y-3 pt-4 border-t border-border">
           {legalLinks.map((link) => (
             <button 
               key={link.label} 
               onClick={() => setSelectedPolicy(link)}
               className="flex w-full items-center justify-between text-xs font-bold text-muted-foreground hover:text-foreground active:text-primary transition-colors"
             >
               {link.label}
               <ExternalLink className="h-3 w-3" />
             </button>
           ))}
        </div>

        <div className="bg-muted/30 rounded-2xl p-6 text-center border-2 border-dashed border-border">
           <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
           <p className="text-sm font-bold text-foreground">Available 24/7 for you</p>
           <p className="text-xs text-muted-foreground mt-1">Our customer success team is here to help you around the clock.</p>
        </div>
      </main>

      {/* Policy Modal */}
      <AnimatePresence>
        {selectedPolicy && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg rounded-[32px] bg-card p-8 shadow-2xl border border-border max-h-[80vh] flex flex-col"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-black text-foreground">{selectedPolicy.label}</h3>
                <button 
                  onClick={() => setSelectedPolicy(null)}
                  className="rounded-full bg-muted p-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap font-medium">
                  {selectedPolicy.content}
                </p>
              </div>
              <button 
                className="mt-8 w-full rounded-2xl bg-primary py-4 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20"
                onClick={() => setSelectedPolicy(null)}
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default HelpSupport;
