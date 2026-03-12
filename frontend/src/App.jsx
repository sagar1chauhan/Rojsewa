import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/context/ThemeContext";
import Index from "./modules/user/pages/Index";
import ShopListing from "./modules/user/pages/ShopListing";
import ShopDetail from "./modules/user/pages/ShopDetail";
import Checkout from "./modules/user/pages/Checkout";
import LiveTracking from "./modules/user/pages/LiveTracking";
import PostService from "./modules/user/pages/PostService";
import Profile from "./modules/user/pages/Profile";
import NotFound from "./modules/user/pages/NotFound";
import BookingWaiting from "./modules/user/pages/BookingWaiting";
import ServiceHistory from "./modules/user/pages/ServiceHistory";
import Wallet from "./modules/user/pages/Wallet";
import Favorites from "./modules/user/pages/Favorites";
import Addresses from "./modules/user/pages/Addresses";
import ReferEarn from "./modules/user/pages/ReferEarn";
import Notifications from "./modules/user/pages/Notifications";
import Security from "./modules/user/pages/Security";
import HelpSupport from "./modules/user/pages/HelpSupport";
import ProviderDashboard from "./modules/provider/pages/ProviderDashboard";
import ProviderBookings from "./modules/provider/pages/ProviderBookings";
import ProviderStaff from "./modules/provider/pages/ProviderStaff";
import ProviderEarnings from "./modules/provider/pages/ProviderEarnings";
import ProviderLogin from "./modules/provider/pages/ProviderLogin";
import ProviderRegister from "./modules/provider/pages/ProviderRegister";
import ProviderProfile from "./modules/provider/pages/ProviderProfile";

// Admin Imports
import AdminLogin from "./modules/admin/pages/AdminLogin";
import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import AdminUsers from "./modules/admin/pages/AdminUsers";
import AdminProviders from "./modules/admin/pages/AdminProviders";
import AdminBookings from "./modules/admin/pages/AdminBookings";
import AdminEarnings from "./modules/admin/pages/AdminEarnings";
import AdminCoupons from "./modules/admin/pages/AdminCoupons";
import AdminFeedback from "./modules/admin/pages/AdminFeedback";
import AdminServices from "./modules/admin/pages/AdminServices";
import AdminSettings from "./modules/admin/pages/AdminSettings";
const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shops" element={<ShopListing />} />
              <Route path="/shop/:id" element={<ShopDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/tracking" element={<LiveTracking />} />
              <Route path="/booking-waiting" element={<BookingWaiting />} />
              <Route path="/my-bookings" element={<ServiceHistory />} />
              <Route path="/post-service" element={<PostService />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/refer-earn" element={<ReferEarn />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/security" element={<Security />} />
              <Route path="/help-support" element={<HelpSupport />} />
              <Route path="/provider" element={<ProviderDashboard />} />
              <Route path="/provider/login" element={<ProviderLogin />} />
              <Route path="/provider/register" element={<ProviderRegister />} />
              <Route path="/provider/profile" element={<ProviderProfile />} />
              <Route path="/provider/bookings" element={<ProviderBookings />} />
              <Route path="/provider/staff" element={<ProviderStaff />} />
              <Route path="/provider/earnings" element={<ProviderEarnings />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/providers" element={<AdminProviders />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/earnings" element={<AdminEarnings />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/feedback" element={<AdminFeedback />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
