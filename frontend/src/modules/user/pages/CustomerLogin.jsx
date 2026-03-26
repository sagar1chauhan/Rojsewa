import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, ArrowRight, ShieldCheck, Sparkles, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState("phone"); // phone | email
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) { setError("Enter valid 10-digit number"); return; }
    setError("");
    setOtpSent(true);
  };

  const handleOtpChange = (idx, val) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 3) document.getElementById(`clogin-otp-${idx + 1}`)?.focus();
    if (newOtp.every(d => d !== "")) {
      setIsVerifying(true);
      setTimeout(() => {
        login({ name: "User", mobile: phone, role: "customer" });
        navigate("/");
      }, 1200);
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Fill all fields"); return; }
    setIsVerifying(true);
    setTimeout(() => {
      login({ name: email.split("@")[0], email, role: "customer" });
      navigate("/");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-emerald-50/30 px-4 py-8 dark:from-background dark:to-background">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md space-y-8">
        
        {/* Logo + Welcome */}
        <div className="text-center">
          <div className="flex justify-center mb-6 mt-4">
             <img src="/RozSewa.png" alt="RojSewa" className="h-[4.5rem] w-auto object-contain" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Welcome Back</h1>
          <p className="mt-2 text-sm font-medium text-muted-foreground">Book trusted services in seconds</p>
        </div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="overflow-hidden rounded-3xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/5">
          
          {/* Mode Tabs */}
          <div className="flex border-b border-border">
            {[
              { id: "phone", label: "Phone", icon: Phone },
              { id: "email", label: "Email", icon: Mail },
            ].map(t => (
              <button key={t.id} onClick={() => { setMode(t.id); setOtpSent(false); setError(""); }}
                className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
                  mode === t.id ? "border-b-2 border-primary text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                }`}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">

              {/* PHONE OTP */}
              {mode === "phone" && !otpSent && (
                <motion.form key="phone-form" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                  onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Mobile Number</label>
                    <div className="flex items-center gap-2">
                      <span className="flex h-12 items-center rounded-xl border border-border bg-muted px-3 text-sm font-bold text-muted-foreground">+91</span>
                      <input type="tel" inputMode="numeric" maxLength={10} value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="h-12 flex-1 rounded-xl border border-border bg-background px-4 text-sm font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                        placeholder="Enter 10 digit number" autoFocus />
                    </div>
                    {error && <p className="mt-2 text-xs font-semibold text-destructive">{error}</p>}
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 py-4 text-sm font-extrabold text-white shadow-xl shadow-primary/20 transition-all hover:shadow-2xl">
                    Send OTP <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </motion.form>
              )}

              {/* OTP VERIFY */}
              {mode === "phone" && otpSent && (
                <motion.div key="otp-verify" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
                  className="space-y-6 text-center">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                      <ShieldCheck className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Verify OTP</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Enter 4-digit code sent to +91 {phone}</p>
                  </div>
                  <div className="flex justify-center gap-3">
                    {otp.map((d, i) => (
                      <input key={i} id={`clogin-otp-${i}`} type="text" inputMode="numeric" maxLength={1}
                        value={d} onChange={(e) => handleOtpChange(i, e.target.value)} disabled={isVerifying}
                        className="h-14 w-14 rounded-xl border-2 border-border bg-background text-center text-2xl font-extrabold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50" />
                    ))}
                  </div>
                  {isVerifying && <p className="text-sm font-semibold text-primary animate-pulse">Verifying...</p>}
                  <button onClick={() => { setOtpSent(false); setOtp(["","","",""]); }}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground">← Change Number</button>
                </motion.div>
              )}

              {/* EMAIL LOGIN */}
              {mode === "email" && (
                <motion.form key="email-form" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
                  onSubmit={handleEmailLogin} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                      placeholder="you@example.com" autoFocus />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                        className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-12 text-sm font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                        placeholder="Enter password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {error && <p className="mt-2 text-xs font-semibold text-destructive">{error}</p>}
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={isVerifying}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 py-4 text-sm font-extrabold text-white shadow-xl shadow-primary/20 disabled:opacity-60">
                    {isVerifying ? "Logging in..." : <>Login <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Social Logins */}
            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-3 font-semibold text-muted-foreground">Or continue with</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-xs font-bold text-foreground hover:bg-muted transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button className="relative flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-xs font-bold text-foreground hover:bg-muted transition-all overflow-hidden">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Apple
                  <span className="absolute -right-7 top-0.5 rotate-45 bg-primary/80 px-7 py-0.5 text-[8px] font-black uppercase text-white">Soon</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">By continuing, you agree to our <button className="font-semibold text-foreground hover:underline">Terms</button> & <button className="font-semibold text-foreground hover:underline">Privacy Policy</button></p>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerLogin;
