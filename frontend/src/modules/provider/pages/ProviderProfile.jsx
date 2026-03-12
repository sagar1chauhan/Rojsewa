import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProviderTopNav from "@/modules/provider/components/ProviderTopNav";
import ProviderBottomNav from "@/modules/provider/components/ProviderBottomNav";
import { User, Store, MapPin, Phone, ShieldCheck, Camera, LogOut } from "lucide-react";

const ProviderProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    ownerName: "Rahul Sharma",
    shopName: "Royal Salon",
    category: "Salon & Grooming",
    mobile: "+91 9876543210",
    address: "123, Main Market Road, City Center",
    profileImage: null
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem("rozsewa_provider_profile");
    if (saved) {
      setProfileData(JSON.parse(saved));
    }
  }, []);

  const toggleEdit = () => {
    if (isEditing) {
      // Save changes
      localStorage.setItem("rozsewa_provider_profile", JSON.stringify(profileData));
    }
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    localStorage.removeItem("rozsewa_provider_auth");
    navigate("/provider/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newData = { ...profileData, profileImage: reader.result };
        setProfileData(newData);
        localStorage.setItem("rozsewa_provider_profile", JSON.stringify(newData));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      <ProviderTopNav />
      
      <main className="container max-w-3xl px-4 py-8 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl bg-emerald-600 p-8 text-center shadow-lg dark:bg-emerald-900/50">
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-emerald-100 text-3xl font-bold text-emerald-700 shadow-sm dark:bg-emerald-900 dark:text-emerald-300">
              {profileData.profileImage ? (
                <img src={profileData.profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                profileData.shopName?.split(' ').map(n => n[0]).join('').toUpperCase() || "RS"
              )}
            </div>
            <button 
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 rounded-full bg-background p-2 text-emerald-600 shadow-md transition-transform hover:scale-110"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{profileData.shopName}</h1>
            <p className="flex items-center justify-center gap-1 text-sm text-emerald-100 font-medium mt-1">
              <ShieldCheck className="h-4 w-4" /> Verified Provider
            </p>
          </div>
        </div>

        {/* Business Info */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Business Information</h2>
            <button 
              onClick={toggleEdit}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-500"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-border/50 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">Owner Name</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-full mt-1 rounded border p-1 text-sm bg-background border-emerald-500 ring-emerald-500 focus:outline-none" 
                    value={profileData.ownerName} 
                    onChange={(e) => setProfileData({...profileData, ownerName: e.target.value})}
                  />
                ) : (
                  <p className="font-semibold text-foreground">{profileData.ownerName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-border/50 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <Store className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">Category</p>
                {isEditing ? (
                  <select 
                    className="w-full mt-1 rounded border p-1 text-sm bg-background border-emerald-500 focus:outline-none"
                    value={profileData.category}
                    onChange={(e) => setProfileData({...profileData, category: e.target.value})}
                  >
                    <option value="Salon & Grooming">Salon & Grooming</option>
                    <option value="AC Repair">AC Repair</option>
                    <option value="Plumbing">Plumbing</option>
                  </select>
                ) : (
                  <p className="font-semibold text-foreground">{profileData.category}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-border/50 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">Mobile Number</p>
                {isEditing ? (
                  <input 
                    type="tel" 
                    className="w-full mt-1 rounded border p-1 text-sm bg-background border-emerald-500 focus:outline-none" 
                    value={profileData.mobile}
                    onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                  />
                ) : (
                  <p className="font-semibold text-foreground">{profileData.mobile}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">Shop Address</p>
                {isEditing ? (
                  <textarea 
                    className="w-full mt-1 rounded border p-1 text-sm bg-background border-emerald-500 focus:outline-none" 
                    value={profileData.address} 
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    rows={2}
                  />
                ) : (
                  <p className="font-semibold text-foreground">{profileData.address}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Subscription & Plans */}
        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-6 dark:bg-emerald-900/10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Pro Plan - Active</h3>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">Valid till 24 Dec 2026</p>
            </div>
            <button className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 transition">
              Upgrade
            </button>
          </div>
        </section>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 py-4 font-bold text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-5 w-5" /> Sign Out from RozSewa Pro
        </button>
        
      </main>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderProfile;
