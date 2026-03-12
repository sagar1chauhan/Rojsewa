import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, Bell, User, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/components/ui/use-toast";

const cities = ["Lucknow", "Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Kolkata", "Chennai"];

const TopNav = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [city, setCity] = useState(() => localStorage.getItem("rozsewa_user_city") || "Lucknow");
  const { isDark, toggleTheme } = useTheme();

  const { toast } = useToast();

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    localStorage.setItem("rozsewa_user_city", selectedCity);
    setShowLocationModal(false);
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      toast({ title: "Accessing Location", description: "Fetching your current city..." });
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Simplified: In a real app we'd use reverse geocoding
            // For this demo, let's pretend we detected their city
            const detectedCity = "Lucknow (Detected)"; 
            handleCitySelect(detectedCity);
            toast({
              title: "Location Updated",
              description: `Successfully detected ${detectedCity}.`,
            });
          } catch (error) {
            toast({
              title: "Location Error",
              description: "Could not resolve your city name.",
              variant: "destructive"
            });
          }
        },
        () => {
          toast({
            title: "Access Denied",
            description: "Please enable location services in your browser.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass border-b border-border/50"
      >
        <div className="container px-2 sm:px-4 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 overflow-hidden w-[105px] sm:w-[120px]">
            <img 
              src="/RozSewa.png" 
              alt="RozSewa Logo" 
              className="h-10 sm:h-12 w-auto object-cover scale-[1.5] sm:scale-[1.3] origin-left" 
            />
          </Link>

          {/* Location */}
          <button 
            onClick={() => setShowLocationModal(true)}
            className="flex shrink-0 items-center justify-center gap-1 rounded-full border border-border bg-background px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-medium transition-colors hover:bg-muted ml-auto mr-2 sm:mx-0"
          >
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <span className="max-w-[70px] truncate sm:max-w-none select-none">{city}</span>
            <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
          </button>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              )}
            </motion.button>
            <button className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-destructive text-[9px] sm:text-[10px] font-bold text-destructive-foreground">3</span>
            </button>
            <Link to="/profile" className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Location Selector Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm rounded-[32px] bg-card p-6 shadow-2xl border border-border"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Select Location</h3>
                <button 
                  onClick={() => setShowLocationModal(false)}
                  className="rounded-full bg-muted p-2 text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown className="h-5 w-5 rotate-180" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCitySelect(c)}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-xs font-bold transition-all ${
                      city === c 
                        ? "border-primary bg-primary/10 text-primary" 
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {c}
                  </button>
                ))}
              </div>
              <button 
                className="mt-6 w-full rounded-2xl bg-primary py-4 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
                onClick={handleUseCurrentLocation}
              >
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin hidden group-data-[loading=true]:block" />
                Use Current Location
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNav;
