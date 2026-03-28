import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store, User, Phone, MapPin, Briefcase, ArrowRight, ArrowLeft, Loader2,
  ShieldCheck, CreditCard, Gift, CheckCircle, Navigation,
  Car, Building, GraduationCap, Home, Utensils, HardHat, Truck, Wrench, Star, FileText
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const vendorTypes = [
  { id: 'shop', label: 'Shop Owner', icon: Store },
  { id: 'service', label: 'Service Provider', icon: Wrench },
  { id: 'taxi', label: 'Taxi / Transport', icon: Car },
  { id: 'hotel', label: 'Hotel / Lodge / PG', icon: Building },
  { id: 'tutor', label: 'Tutor / Doctor', icon: GraduationCap },
  { id: 'property', label: 'Property Dealer', icon: Home },
  { id: 'food', label: 'Food / Tiffin', icon: Utensils },
  { id: 'labour', label: 'Labour Contractor', icon: HardHat },
  { id: 'delivery', label: 'Delivery Service', icon: Truck },
];

const ProviderRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
    vendorType: "",
    ownerName: "",
    shopName: "",
    gst: "",
    kycAadhaar: "",
    serviceRadius: "5",
    referralCode: "",
    employeeCode: "",
  });

  const [generatedCode, setGeneratedCode] = useState("");
  const [cardConfig, setCardConfig] = useState({ enabled: true, price: 99 });

  useEffect(() => {
     const settingsList = localStorage.getItem("rozsewa_platform_settings");
     if (settingsList) {
        const parsed = JSON.parse(settingsList);
        setCardConfig({ 
           enabled: parsed.vendorCardEnabled !== false, 
           price: parsed.vendorCardPrice !== undefined ? parsed.vendorCardPrice : 99 
        });
     }
  }, []);

  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data && data.display_name) {
              setAddress(data.display_name);
            }
          } catch (error) {
            console.error("Error fetching address:", error);
          } finally {
            setIsFetchingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsFetchingLocation(false);
          toast({ title: "Location Error", description: "Could not fetch location.", variant: "destructive" });
        }
      );
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (formData.mobile.length !== 10) return;
    setIsLoading(true);
    setTimeout(() => { 
      setIsLoading(false); 
      setOtpSent(true); 
      toast({ title: "OTP Sent", description: "Please check your mobile." });
    }, 1000);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!formData.otp) return;
    setIsLoading(true);
    setTimeout(() => { 
      setIsLoading(false); 
      setStep(2); 
    }, 1000);
  };
  
  const handleVendorTypeSelect = (type) => {
    setFormData({ ...formData, vendorType: type });
    setTimeout(() => setStep(3), 300);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!formData.ownerName || !formData.shopName || !address) {
      toast({ title: "Incomplete", description: "Please fill all required fields including address.", variant: "destructive" });
      return;
    }
    setStep(4);
  };

  const handleReferralSubmit = (e) => {
    e.preventDefault();
    if (cardConfig.enabled) {
       setStep(5);
    } else {
       setIsLoading(true);
       setTimeout(() => {
         setIsLoading(false);
         const code = "RSVND" + Math.floor(10000 + Math.random() * 90000);
         setGeneratedCode(code);
         const finalData = { ...formData, address, vendorCode: code, status: "pending", joined: new Date().toISOString().split('T')[0] };
         localStorage.setItem("rozsewa_provider_profile", JSON.stringify(finalData));
         setStep(6);
         toast({ title: "Registration Successful", description: "Profile generated." });
       }, 1500);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const code = "RSVND" + Math.floor(10000 + Math.random() * 90000);
      setGeneratedCode(code);
      
      const finalData = { ...formData, address, vendorCode: code, status: "pending", joined: new Date().toISOString().split('T')[0] };
      localStorage.setItem("rozsewa_provider_profile", JSON.stringify(finalData));
      
      setStep(6);
      toast({ title: "Payment Successful", description: "99 Card activated successfully." });
    }, 2000);
  };

  const stepTitles = [
    "Mobile Verification",
    "Choose Business Type",
    "Business Profile",
    "Referral & Network",
    cardConfig.price > 0 ? `Join RozSewa Pro` : "Registration Options",
    "Welcome on Board!"
  ];

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8 md:py-12 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="w-full max-w-lg space-y-6 my-auto pt-6 pb-20 md:py-0">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/50"
          >
            {step === 6 ? (
              <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            ) : step === 5 ? (
              <CreditCard className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Store className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            )}
          </motion.div>
          <h2 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            {stepTitles[step - 1]}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {step < 6 ? `Step ${step} of ${cardConfig.enabled ? 5 : 4}` : 'Registration Complete'}
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 md:p-8 shadow-sm"
        >
          {/* Progress Bar */}
          {step < 6 && (
            <div className="mb-6 md:mb-8 flex h-2 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full bg-emerald-600 transition-all duration-500 ease-in-out" 
                style={{ width: `${(step / (cardConfig.enabled ? 5 : 4)) * 100}%` }}
              ></div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: MOBILE & OTP */}
            {step === 1 && (
              <motion.div key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium text-foreground">Mobile Number</label>
                      <div className="relative mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Phone className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <input id="mobile" type="tel" required
                          value={formData.mobile}
                          onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
                          maxLength="10"
                          className="block w-full rounded-xl border border-border bg-background py-3 md:py-3.5 pl-10 pr-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm md:text-base"
                          placeholder="Enter 10 digit number"
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={isLoading || formData.mobile.length !== 10}
                      className="group flex w-full justify-center items-center rounded-xl bg-emerald-600 px-4 py-3 md:py-3.5 text-sm md:text-base font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70"
                    >
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send OTP"}
                      {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="otp" className="block text-sm font-medium text-foreground">Enter OTP</label>
                        <button type="button" onClick={() => setOtpSent(false)} className="text-xs font-bold text-emerald-600">Change Number</button>
                      </div>
                      <div className="relative text-center">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <ShieldCheck className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <input id="otp" type="text" required inputMode="numeric"
                          value={formData.otp}
                          onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
                          maxLength="6"
                          className="block w-full text-center tracking-[0.5em] font-bold rounded-xl border border-border bg-background py-3 md:py-3.5 pl-10 pr-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-lg md:text-xl"
                          placeholder="••••••"
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={isLoading || formData.otp.length < 4}
                      className="group flex w-full justify-center items-center rounded-xl bg-emerald-600 px-4 py-3 md:py-3.5 text-sm md:text-base font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70"
                    >
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Continue"}
                      {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* STEP 2: VENDOR TYPE */}
            {step === 2 && (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4 md:mb-6">Select the category that best fits your business.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {vendorTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleVendorTypeSelect(type.id)}
                      className={`flex flex-col items-center justify-center gap-2 md:gap-3 rounded-2xl border p-3 md:p-4 text-center transition-all ${
                        formData.vendorType === type.id 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                        : 'border-border bg-background hover:border-emerald-200 hover:bg-emerald-50/50'
                      }`}
                    >
                      <type.icon className={`h-6 w-6 md:h-8 md:w-8 ${formData.vendorType === type.id ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                      <span className="text-[10px] md:text-xs font-bold leading-tight">{type.label}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-4 flex justify-start border-t border-border mt-4">
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: BUSINESS PROFILE */}
            {step === 3 && (
              <motion.form key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} onSubmit={handleProfileSubmit} className="space-y-4 md:space-y-5">
                <div className="grid grid-cols-1 gap-4 md:gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Owner Name *</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><User className="h-4 w-4 text-muted-foreground" /></div>
                      <input type="text" required value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                        className="block w-full rounded-xl border border-border bg-background py-2.5 md:py-3 pl-10 pr-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="Full Name" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Shop/Business Name *</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Store className="h-4 w-4 text-muted-foreground" /></div>
                      <input type="text" required value={formData.shopName} onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                        className="block w-full rounded-xl border border-border bg-background py-2.5 md:py-3 pl-10 pr-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="Business Name" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-foreground mb-1">GST Number (Optional)</label>
                    <input type="text" value={formData.gst} onChange={(e) => setFormData({...formData, gst: e.target.value})}
                      className="block w-full rounded-xl border border-border bg-background py-2.5 md:py-3 px-3 uppercase text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="22AAAAA0000A1Z5" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-foreground mb-1">Aadhaar/PAN (KYC) *</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><FileText className="h-4 w-4 text-muted-foreground" /></div>
                      <input type="text" required value={formData.kycAadhaar} onChange={(e) => setFormData({...formData, kycAadhaar: e.target.value})}
                        className="block w-full rounded-xl border border-border bg-background py-2.5 md:py-3 pl-10 pr-3 uppercase text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="ID Number" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs md:text-sm font-medium text-foreground">Service Address *</label>
                    <button type="button" onClick={fetchLocation} className="text-[10px] md:text-xs font-bold text-emerald-600 flex items-center">
                      <Navigation className="mr-1 h-3 w-3" /> Auto Fetch
                    </button>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3">
                      <MapPin className={`h-4 w-4 ${isFetchingLocation ? 'animate-pulse text-emerald-500' : 'text-muted-foreground'}`} />
                    </div>
                    <textarea rows={2} required value={address} onChange={(e) => setAddress(e.target.value)}
                      className="block w-full rounded-xl border border-border bg-background py-2.5 md:py-3 pl-10 pr-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-75"
                      placeholder={isFetchingLocation ? "Fetching..." : "Complete Address"} disabled={isFetchingLocation} />
                  </div>
                </div>

                <div className="flex gap-2 md:gap-3 pt-2">
                  <button type="button" onClick={() => setStep(2)} className="flex w-1/3 justify-center items-center rounded-xl border border-border bg-card px-2 md:px-4 py-3 text-xs md:text-sm font-bold transition-all hover:bg-muted"><ArrowLeft className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" /> Back</button>
                  <button type="submit" className="flex w-2/3 justify-center items-center rounded-xl bg-emerald-600 px-4 py-3 text-xs md:text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700">Continue <ArrowRight className="ml-1 md:ml-2 h-4 md:h-5 w-4 md:w-5" /></button>
                </div>
              </motion.form>
            )}

            {/* STEP 4: REFERRAL CODE */}
            {step === 4 && (
              <motion.form key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} onSubmit={handleReferralSubmit} className="space-y-4 md:space-y-6">
                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 md:p-5">
                   <h3 className="flex items-center text-sm md:text-base font-bold text-emerald-800 dark:text-emerald-400 mb-2">
                     <Gift className="mr-2 h-5 w-5" /> Have a Referral Code?
                   </h3>
                   <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mb-4">
                     Enter a valid vendor or employee code to unlock onboarding bonuses and verified badges.
                   </p>
                   
                   <div className="space-y-3 md:space-y-4">
                     <div>
                       <label className="block text-[10px] md:text-xs font-bold uppercase tracking-wider text-emerald-700/70 mb-1">Referral Code (Optional)</label>
                       <input type="text" value={formData.referralCode} onChange={(e) => setFormData({...formData, referralCode: e.target.value.toUpperCase()})}
                         className="block w-full rounded-xl border border-emerald-200 bg-white dark:bg-emerald-900/40 py-2.5 md:py-3 px-3 uppercase text-sm font-bold tracking-wider focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="e.g. RSVND123" />
                     </div>
                     <div>
                       <label className="block text-[10px] md:text-xs font-bold uppercase tracking-wider text-emerald-700/70 mb-1">Employee Code (Optional)</label>
                       <input type="text" value={formData.employeeCode} onChange={(e) => setFormData({...formData, employeeCode: e.target.value.toUpperCase()})}
                         className="block w-full rounded-xl border border-emerald-200 bg-white dark:bg-emerald-900/40 py-2.5 md:py-3 px-3 uppercase text-sm font-bold tracking-wider focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="e.g. EMP880" />
                     </div>
                   </div>
                </div>

                <div className="flex gap-2 md:gap-3">
                  <button type="button" onClick={() => setStep(3)} className="flex w-1/3 justify-center items-center rounded-xl border border-border bg-card px-2 md:px-4 py-3 text-xs md:text-sm font-bold transition-all hover:bg-muted"><ArrowLeft className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" /> Back</button>
                  <button type="submit" className="flex w-2/3 justify-center items-center rounded-xl bg-emerald-600 px-4 py-3 text-xs md:text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700">Skip / Next <ArrowRight className="ml-1 md:ml-2 h-4 md:h-5 w-4 md:w-5" /></button>
                </div>
              </motion.form>
            )}

            {/* STEP 5: 99 CARD PURCHASE */}
            {step === 5 && (
              <motion.form key="step5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} onSubmit={handlePayment} className="space-y-4 md:space-y-6">
                <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex flex-wrap justify-between items-start mb-4 md:mb-6 gap-2">
                      <div>
                        <h3 className="text-lg md:text-xl font-black">{cardConfig.price > 0 ? `RozSewa ${cardConfig.price} Card` : 'RozSewa Vendor Card'}</h3>
                        <p className="text-emerald-100 text-[10px] md:text-xs mt-0.5 md:mt-1 font-semibold uppercase tracking-wider">Mandatory for Registration</p>
                      </div>
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs md:text-sm font-bold backdrop-blur-md">₹{cardConfig.price} / yr</span>
                    </div>
                    
                    <ul className="space-y-2.5 md:space-y-3 text-xs md:text-sm font-medium">
                      <li className="flex items-center"><CheckCircle className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-200" /> Vendor Verified Badge</li>
                      <li className="flex items-center"><CheckCircle className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-200" /> Priority Listing & Support</li>
                      <li className="flex items-center"><CheckCircle className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-200" /> Referral Benefits (Zero Comm.)</li>
                      <li className="flex items-center"><CheckCircle className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-200" /> Business Booster Tools</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 md:p-4 text-[10px] md:text-xs text-amber-800 font-medium">
                  <strong className="font-bold">Important:</strong> Platform registration completes only after the card purchase. This filters out fake profiles and keeps our community secure.
                </div>

                <div className="flex gap-2 md:gap-3">
                  <button type="button" onClick={() => setStep(4)} className="flex w-1/3 justify-center items-center rounded-xl border border-border bg-card px-2 md:px-4 py-3 text-xs md:text-sm font-bold transition-all hover:bg-muted"><ArrowLeft className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" /> Back</button>
                  <button type="submit" disabled={isLoading} className="flex w-2/3 justify-center items-center rounded-xl bg-emerald-600 px-4 py-3 text-xs md:text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-70">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4 md:h-5 md:w-5" />}
                    {isLoading ? "Processing..." : `Pay ₹${cardConfig.price} & Join`}
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 6: SUCCESS & VENDOR CODE */}
            {step === 6 && (
              <motion.div key="step6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-5 md:space-y-6 text-center py-2 md:py-4">
                <div className="mx-auto flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-emerald-100 mb-2 md:mb-4">
                  <Star className="h-8 w-8 md:h-10 md:w-10 text-emerald-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-foreground">Welcome to RozSewa!</h3>
                <p className="text-xs md:text-sm text-muted-foreground px-2 md:px-4">
                  Your business profile is created. Our team will verify your KYC details shortly.
                </p>

                <div className="mt-4 md:mt-6 rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-5 md:p-6 shadow-inner">
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1 md:mb-2">Your Vendor Referral Code</p>
                  <div className="text-2xl md:text-3xl font-black tracking-widest text-emerald-700 dark:text-emerald-300 font-mono">
                    {generatedCode}
                  </div>
                  <p className="text-[10px] md:text-xs text-emerald-600/80 mt-2 md:mt-3">Share this to earn 100% Commission-Free jobs!</p>
                </div>

                <div className="pt-2 md:pt-4">
                  <Link to="/provider/login" className="flex w-full justify-center items-center rounded-xl bg-emerald-600 px-4 py-3.5 md:py-4 text-xs md:text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-700 hover:-translate-y-1">
                    Go to Provider Login <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 5 && (
            <div className="mt-6 md:mt-8 flex justify-center border-t border-border pt-6">
              <span className="text-xs md:text-sm text-muted-foreground mr-1">Already have an account? </span>
              <Link to="/provider/login" className="text-xs md:text-sm font-bold text-emerald-600 hover:text-emerald-500">
                Sign in
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderRegister;
