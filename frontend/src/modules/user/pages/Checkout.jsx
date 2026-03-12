import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, CreditCard, Wallet, Tag, Clock, Plus, Home, Briefcase, X, Check, ShieldCheck, Copy, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/modules/user/components/TopNav";
import BottomNav from "@/modules/user/components/BottomNav";
import { useToast } from "@/components/ui/use-toast";

const dates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return { day: d.toLocaleDateString("en", { weekday: "short" }), date: d.getDate(), full: d.toISOString().split("T")[0] };
});

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

const defaultAddresses = [
  { id: 1, label: "Home", address: "123 MG Road, Lucknow, UP 226001", icon: "home" },
  { id: 2, label: "Office", address: "456 Hazratganj, Lucknow, UP 226001", icon: "office" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(dates[0].full);
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMode, setPaymentMode] = useState("now");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [serviceNotes, setServiceNotes] = useState("");
  const [appliedCouponData, setAppliedCouponData] = useState(null);

  // Address state
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("rozsewa_saved_addresses");
    return saved ? JSON.parse(saved) : defaultAddresses;
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", address: "" });
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // OTP + Booking Confirmed
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses]);

  const applyCoupon = () => {
    const savedCoupons = JSON.parse(localStorage.getItem("rozsewa_admin_coupons") || "[]");
    const found = savedCoupons.find(c => c.code.toUpperCase() === coupon.toUpperCase() && c.status === "active");
    
    if (found) {
      setAppliedCouponData(found);
      setCouponApplied(true);
      setShowConfetti(true);
      toast({ title: "Coupon Applied!", description: `You saved with ${found.code}` });
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      toast({ title: "Invalid Coupon", description: "This code is expired or incorrect.", variant: "destructive" });
    }
  };

  const checkoutData = JSON.parse(localStorage.getItem("rozsewa_checkout_data")) || {
    shopName: "Provider",
    category: "Salon",
    items: [{ name: "Demo Service" }],
    total: 497
  };

  const subtotal = checkoutData.total || 497;
  const serviceNames = checkoutData.items?.length > 0 ? checkoutData.items.map(i => i.name).join(", ") : "General Service";
  
  let discount = 0;
  if (couponApplied && appliedCouponData) {
    if (appliedCouponData.discount.includes("%")) {
      const percent = parseInt(appliedCouponData.discount);
      discount = Math.round(subtotal * (percent / 100));
    } else {
      discount = parseInt(appliedCouponData.discount.replace(/[^0-9]/g, "")) || 0;
    }
  }
  const total = subtotal - discount;

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            const data = await res.json();
            if (data?.display_name) {
              setNewAddress(prev => ({ ...prev, address: data.display_name }));
            }
          } catch { }
          setIsFetchingLocation(false);
        },
        () => setIsFetchingLocation(false)
      );
    }
  };

  const handleSaveNewAddress = () => {
    if (!newAddress.label || !newAddress.address) return;
    const updated = [...addresses, { id: Date.now(), label: newAddress.label, address: newAddress.address, icon: "home" }];
    setAddresses(updated);
    localStorage.setItem("rozsewa_saved_addresses", JSON.stringify(updated));
    setSelectedAddress(updated[updated.length - 1]);
    setNewAddress({ label: "", address: "" });
    setShowNewAddressForm(false);
    setShowAddressModal(false);
  };

  const handleOtpChange = (idx, val) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 3) document.getElementById(`checkout-otp-${idx + 1}`)?.focus();
    if (newOtp.every(d => d !== "")) {
      setIsVerifying(true);
      setTimeout(() => {
        const id = `ROJ-${Date.now().toString(36).toUpperCase()}`;
        setBookingId(id);
        // Get user profile if exists, else mock
        const userProfile = JSON.parse(localStorage.getItem("rozsewa_user_profile") || '{"name":"Sagar Chauhan","mobile":"9876543210"}');
        
        // Save booking to localStorage with expanded fields for Provider/Admin simulation
        const booking = { 
          id, 
          user: userProfile.name || "Sagar Chauhan",
          userMobile: userProfile.mobile || "9876543210",
          providerId: null,
          provider: "Unassigned",
          category: checkoutData.category || "Salon", 
          service: serviceNames, 
          date: selectedDate, 
          time: selectedTime, 
          address: selectedAddress.address, 
          amount: total, 
          paymentMode, 
          paymentStatus: paymentMode === "now" ? "paid" : "pending",
          notes: serviceNotes, 
          status: "pending", // Provider needs to accept it first
          createdAt: new Date().toISOString() 
        };
        const bookings = JSON.parse(localStorage.getItem("rozsewa_bookings") || "[]");
        bookings.unshift(booking); // Add to beginning of array
        localStorage.setItem("rozsewa_bookings", JSON.stringify(bookings));
        setBookingConfirmed(true);
        setShowOTPModal(false);
        setIsVerifying(false);
      }, 1500);
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedTime) return;
    if (!selectedAddress) {
      toast({ title: "Select Address", description: "Please select a delivery address.", variant: "destructive" });
      return;
    }
    setShowOTPModal(true);
  };

  // ─── BOOKING CONFIRMED SCREEN ─────────────────────────────────
  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md text-center space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-12 w-12 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Booking Confirmed! 🎉</h1>
            <p className="mt-2 text-sm text-muted-foreground">Your service has been scheduled successfully.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Booking ID</span>
              <button onClick={() => { navigator.clipboard.writeText(bookingId); toast({ title: "Copied!", description: bookingId }); }}
                className="flex items-center gap-1 text-sm font-bold text-primary">
                {bookingId} <Copy className="h-3 w-3" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Date & Time</span>
              <span className="text-sm font-semibold text-foreground">{selectedDate} • {selectedTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Amount</span>
              <span className="text-sm font-bold text-foreground">₹{total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Payment</span>
              <span className="text-sm font-semibold text-foreground">{paymentMode === "now" ? "Paid Online" : "Pay After Service"}</span>
            </div>
          </div>

          {/* Cancellation Rules */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left">
            <h4 className="text-xs font-bold text-primary mb-2">Cancellation Policy</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Free cancellation within <span className="font-bold text-foreground">5 minutes</span> of booking.</li>
              <li>• ₹50 cancellation fee after 5 minutes.</li>
              <li>• No cancellation after provider starts travelling.</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/tracking")}
              className="flex-1 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg">
              Track Booking
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/my-bookings")}
              className="flex-1 rounded-2xl border border-border py-3.5 text-sm font-bold text-foreground hover:bg-muted">
              My Bookings
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── MAIN CHECKOUT ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="text-xl font-bold text-foreground">Checkout</h1>
        </div>

        {/* Date Picker */}
        <section>
          <h2 className="mb-3 text-sm font-bold text-foreground flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Select Date</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((d) => (
              <motion.button key={d.full} whileTap={{ scale: 0.93 }} onClick={() => setSelectedDate(d.full)}
                className={`flex min-w-[72px] flex-col items-center rounded-2xl border-2 py-3 px-4 transition-all ${
                  selectedDate === d.full ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-card-foreground hover:bg-muted"
                }`}>
                <span className="text-[10px] font-semibold uppercase opacity-70">{d.day}</span>
                <span className="text-xl font-extrabold">{d.date}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Time Slots */}
        <section>
          <h2 className="mb-3 text-sm font-bold text-foreground">Select Time</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {timeSlots.map((t) => (
              <motion.button key={t} whileTap={{ scale: 0.93 }} onClick={() => setSelectedTime(t)}
                className={`rounded-xl py-2.5 text-xs font-semibold transition-all ${
                  selectedTime === t ? "bg-primary text-primary-foreground" : "border border-border bg-card text-card-foreground hover:bg-muted"
                }`}>{t}</motion.button>
            ))}
          </div>
        </section>

        {/* ─── Address Section ─────────────────────────── */}
        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-card-foreground flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h3>
            <button onClick={() => setShowAddressModal(true)} className="text-xs font-semibold text-primary hover:underline">Change</button>
          </div>
          {selectedAddress ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                {selectedAddress.icon === "office" ? <Briefcase className="h-5 w-5 text-primary" /> : <Home className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <p className="text-sm font-bold text-card-foreground">{selectedAddress.label}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{selectedAddress.address}</p>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddressModal(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-primary/40 text-sm font-semibold text-primary hover:bg-primary/5">
              <Plus className="h-4 w-4" /> Add Address
            </button>
          )}
        </section>

        {/* Coupon */}
        <section className="relative rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-card-foreground"><Tag className="h-4 w-4 text-secondary" /> Apply Coupon</h3>
          <div className="flex gap-2">
            <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter coupon code" disabled={couponApplied}
              className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50" />
            <motion.button whileTap={{ scale: 0.93 }} onClick={applyCoupon} disabled={couponApplied}
              className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-foreground disabled:opacity-50">
              {couponApplied ? "Applied ✓" : "Apply"}
            </motion.button>
          </div>
          <AnimatePresence>
            {showConfetti && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div key={i} initial={{ x: "50%", y: "50%", opacity: 1, scale: 0 }}
                    animate={{ x: `${Math.random() * 100}%`, y: `${Math.random() * -150}%`, opacity: 0, scale: 1, rotate: Math.random() * 720 }}
                    transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
                    className="absolute h-2 w-2 rounded-full"
                    style={{ backgroundColor: ["#22c55e", "#eab308", "#ef4444", "#3b82f6", "#a855f7"][i % 5] }} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Service Notes */}
        <section className="rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-bold text-card-foreground">Service Notes</h3>
          <textarea placeholder="Any special instructions..." rows={3} value={serviceNotes} onChange={(e) => setServiceNotes(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </section>

        {/* Price Summary */}
        <section className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <div className="flex justify-between text-sm text-card-foreground"><span>Subtotal</span><span className="font-semibold">₹{subtotal}</span></div>
          {couponApplied && <div className="flex justify-between text-sm text-primary"><span>Discount (30%)</span><span className="font-semibold">-₹{discount}</span></div>}
          <div className="border-t border-border pt-2 flex justify-between text-base font-extrabold text-foreground"><span>Total</span><span>₹{total}</span></div>
        </section>

        {/* Payment Mode */}
        <section>
          <h3 className="mb-3 text-sm font-bold text-foreground flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Payment</h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setPaymentMode("now")}
              className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${paymentMode === "now" ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
              <CreditCard className={`h-6 w-6 ${paymentMode === "now" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs font-bold">Pay Now</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setPaymentMode("after")}
              className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${paymentMode === "after" ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
              <Wallet className={`h-6 w-6 ${paymentMode === "after" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs font-bold">Pay After Service</span>
            </motion.button>
          </div>
        </section>

        {/* Confirm */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleConfirmBooking} disabled={!selectedTime}
          className="w-full rounded-2xl bg-primary py-4 text-base font-extrabold text-primary-foreground shadow-xl transition-opacity disabled:opacity-50">
          Confirm Booking — ₹{total}
        </motion.button>
      </main>
      <BottomNav />

      {/* ─── ADDRESS SELECT MODAL ────────────────────── */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 p-4">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h3 className="text-lg font-bold text-foreground">Select Address</h3>
                <button onClick={() => { setShowAddressModal(false); setShowNewAddressForm(false); }} className="rounded-full p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {addresses.map(addr => (
                  <button key={addr.id} onClick={() => { setSelectedAddress(addr); setShowAddressModal(false); }}
                    className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                      selectedAddress?.id === addr.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                    }`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {addr.icon === "office" ? <Briefcase className="h-5 w-5 text-primary" /> : <Home className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{addr.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{addr.address}</p>
                    </div>
                    {selectedAddress?.id === addr.id && <Check className="h-5 w-5 text-primary shrink-0" />}
                  </button>
                ))}

                {!showNewAddressForm ? (
                  <button onClick={() => setShowNewAddressForm(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-primary/40 text-sm font-semibold text-primary hover:bg-primary/5">
                    <Plus className="h-4 w-4" /> Add New Address
                  </button>
                ) : (
                  <div className="space-y-3 rounded-2xl border border-border p-4">
                    <input type="text" placeholder="Label (e.g. Home, Office)" value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none" />
                    <div className="relative">
                      <textarea rows={2} placeholder={isFetchingLocation ? "Detecting location..." : "Full address"} value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} disabled={isFetchingLocation}
                        className="w-full rounded-xl border border-border bg-background p-3 pr-10 text-sm focus:border-primary focus:outline-none disabled:opacity-70" />
                      <button type="button" onClick={handleDetectLocation}
                        className="absolute top-3 right-3 text-primary hover:text-primary/80" title="Detect location">
                        <Navigation className={`h-4 w-4 ${isFetchingLocation ? "animate-pulse" : ""}`} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowNewAddressForm(false)}
                        className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold text-foreground hover:bg-muted">Cancel</button>
                      <button onClick={handleSaveNewAddress}
                        className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground">Save</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── OTP VERIFICATION MODAL ──────────────────── */}
      <AnimatePresence>
        {showOTPModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-2xl border border-border">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Verify Booking</h3>
              <p className="mt-1 text-xs text-muted-foreground">Enter OTP sent to your registered mobile</p>
              <div className="mt-6 flex justify-center gap-3">
                {otp.map((d, i) => (
                  <input key={i} id={`checkout-otp-${i}`} type="text" inputMode="numeric" maxLength={1}
                    value={d} onChange={(e) => handleOtpChange(i, e.target.value)} disabled={isVerifying}
                    className="h-14 w-14 rounded-xl border-2 border-border bg-background text-center text-2xl font-extrabold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50" />
                ))}
              </div>
              {isVerifying && <p className="mt-4 text-sm font-semibold text-primary animate-pulse">Verifying...</p>}
              <button onClick={() => { setShowOTPModal(false); setOtp(["", "", "", ""]); }}
                className="mt-5 text-sm font-semibold text-muted-foreground hover:text-foreground">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
