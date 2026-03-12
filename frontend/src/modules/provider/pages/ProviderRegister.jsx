import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Store, User, Phone, MapPin, Briefcase, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const ProviderRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: "",
    shopName: "",
    mobile: "",
    category: "",
  });

  useEffect(() => {
    if (step === 2 && !address) {
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
          }
        );
      }
    }
  }, [step]);

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const finalData = { ...formData, address };
    localStorage.setItem("rozsewa_provider_profile", JSON.stringify(finalData));
    // Simulate API registration call and go to login
    navigate("/provider/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/50"
          >
            <Store className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground">
            Grow your business
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Register as a RozSewa Pro provider
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          {/* Progress Bar */}
          <div className="mb-8 flex items-center justify-between">
            <div className={`h-2 w-1/2 rounded-l-full ${step >= 1 ? 'bg-emerald-600' : 'bg-muted'}`}></div>
            <div className={`h-2 w-1/2 rounded-r-full ml-1 ${step >= 2 ? 'bg-emerald-600' : 'bg-muted'}`}></div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                onSubmit={handleNext}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="ownerName" className="block text-sm font-medium text-foreground">
                    Owner Name
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <input id="ownerName" type="text" required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="block w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium text-foreground">
                    Shop / Service Name
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Store className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <input id="shopName" type="text" required
                      value={formData.shopName}
                      onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                      className="block w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                      placeholder="e.g. Royal Men's Salon"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-foreground">
                    Mobile Number
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <input id="mobile" type="tel" required
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      maxLength="10"
                      className="block w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                      placeholder="Enter 10 digit number"
                    />
                  </div>
                </div>

                <button type="submit"
                  className="group flex w-full justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-[0.98]"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                onSubmit={handleRegister}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-foreground">
                    Primary Service Category
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <select id="category" required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="block w-full appearance-none rounded-xl border border-border bg-background py-3 pl-10 pr-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      <option value="salon">Salon & Grooming</option>
                      <option value="ac">AC & Appliance Repair</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrician">Electrician</option>
                      <option value="cleaning">Cleaning Services</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="address" className="block text-sm font-medium text-foreground">
                      Shop / Home Address
                    </label>
                    {isFetchingLocation && (
                      <span className="flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Detecting...
                      </span>
                    )}
                  </div>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3">
                      <MapPin className={`h-5 w-5 ${isFetchingLocation ? 'animate-pulse text-emerald-500' : 'text-muted-foreground'}`} aria-hidden="true" />
                    </div>
                    <textarea id="address" rows={3} required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="block w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm disabled:opacity-75"
                      placeholder={isFetchingLocation ? "Fetching current location..." : "Enter complete address"}
                      disabled={isFetchingLocation}
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex w-1/3 justify-center rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back
                  </button>
                  <button type="submit"
                    className="flex w-2/3 justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-[0.98]"
                  >
                    Complete Registration
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/provider/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderRegister;
