import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, Bell, User, Moon, Sun, Search, Menu, X, Home, Store, ClipboardList, Zap, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/components/ui/use-toast";

const cities = ["Lucknow", "Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Kolkata", "Chennai"];

const navLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "Services", path: "/shops", icon: Store },
  { label: "My Bookings", path: "/my-bookings", icon: ClipboardList },
  { label: "Favorites", path: "/favorites", icon: Heart },
];

const TopNav = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [city, setCity] = useState(() => localStorage.getItem("rozsewa_user_city") || "Lucknow");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass border-b border-border/50"
      >
        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex h-16 items-center gap-6">
              {/* Logo */}
              <Link to="/" className="flex items-center shrink-0 mr-2">
                <img 
                  src="/RozSewa.png" 
                  alt="RozSewa Logo" 
                  className="h-10 w-auto object-contain" 
                />
              </Link>

              {/* Location Chip */}
              <button 
                onClick={() => setShowLocationModal(true)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium transition-all hover:bg-muted hover:border-primary/30 group"
              >
                <MapPin className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                <span className="max-w-[100px] truncate select-none text-foreground/80">{city}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {/* Nav Links */}
              <nav className="flex items-center gap-1 ml-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive(link.path)
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {link.label}
                    {isActive(link.path) && (
                      <motion.div
                        layoutId="desktop-nav-indicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
              </nav>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all hover:bg-muted hover:border-primary/30"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="h-[18px] w-[18px] text-secondary" />
                  ) : (
                    <Moon className="h-[18px] w-[18px] text-foreground/70" />
                  )}
                </motion.button>

                {/* Notifications */}
                <Link 
                  to="/notifications"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all hover:bg-muted hover:border-primary/30"
                >
                  <Bell className="h-[18px] w-[18px] text-foreground/70" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-sm">3</span>
                </Link>

                {/* Divider */}
                <div className="h-6 w-px bg-border mx-1" />

                {/* Profile */}
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 rounded-full border border-border bg-background pl-1 pr-3 py-1 transition-all hover:bg-muted hover:border-primary/30 hover:shadow-sm group"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground/80">Account</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navbar (unchanged behavior) */}
        <div className="md:hidden">
          <div className="container px-2 sm:px-4 flex h-14 items-center justify-between">
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
              className="flex shrink-0 items-center justify-center gap-1 rounded-full border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium transition-colors hover:bg-muted ml-auto mr-2"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="max-w-[70px] truncate select-none">{city}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-secondary" />
                ) : (
                  <Moon className="h-4 w-4 text-foreground" />
                )}
              </motion.button>
              <button className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted">
                <Bell className="h-4 w-4 text-foreground" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">3</span>
              </button>
              <Link to="/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
                <User className="h-4 w-4" />
              </Link>
            </div>
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
