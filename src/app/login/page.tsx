"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, UserPlus, LogIn, ShieldCheck, Activity, ChevronRight, Zap } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password. Please try again.");
        } else {
          setSuccess("Authentication successful. Redirecting...");
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 800);
        }
      } else {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, firstName, lastName, gender, dateOfBirth }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccess("Account created! Please log in.");
          setTimeout(() => {
            setIsLogin(true);
            setSuccess("");
            setPassword("");
          }, 1500);
        } else {
          setError(data.error || "Failed to create account.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#031119] relative overflow-hidden font-sans selection:bg-[#01F0D0] selection:text-[#072635]">
      {/* Animated Background Gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-gradient-to-r from-[#01F0D0]/20 to-transparent rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 100, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-gradient-to-l from-[#072635] to-[#01F0D0]/10 rounded-full blur-[150px]" 
      />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] shadow-2xl shadow-[#01F0D0]/5 overflow-hidden m-4 relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10">
        
        {/* Left Side: Visual / Brand */}
        <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden bg-gradient-to-br from-[#072635] to-[#04151e]">
          {/* Glassmorphism shapes behind text */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-[#01F0D0] rounded-full mix-blend-overlay filter blur-[50px] opacity-60 animate-pulse" />
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-500 rounded-full mix-blend-overlay filter blur-[60px] opacity-40" />

          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Image src="/TestLogo.png" alt="Coalition Technologies" width={200} height={40} className="brightness-0 invert mb-20" />
            </motion.div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <h2 className="text-5xl xl:text-6xl font-black leading-[1.1] text-white">
                  Intelligent <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01F0D0] to-blue-400">
                    Healthcare
                  </span> <br/>
                  Dashboard.
                </h2>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-gray-300 max-w-md font-medium leading-relaxed"
              >
                Experience the next generation of medical data management. Seamless, secure, and blazingly fast.
              </motion.p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative z-10 grid grid-cols-2 gap-4 mt-12"
          >
            <div className="group flex items-center space-x-4 bg-white/5 hover:bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#01F0D0]/20 to-transparent flex items-center justify-center text-[#01F0D0] group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Bank-grade</span>
                <span className="block text-xs text-gray-400">Security</span>
              </div>
            </div>
            <div className="group flex items-center space-x-4 bg-white/5 hover:bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#01F0D0]/20 to-transparent flex items-center justify-center text-[#01F0D0] group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Real-time</span>
                <span className="block text-xs text-gray-400">Updates</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-14 flex flex-col justify-center bg-white/95 backdrop-blur-3xl relative">
          <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-transparent via-[#01F0D0] to-transparent opacity-50" />
          
          <div className="mb-10">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden flex justify-center mb-8 bg-[#072635] p-4 rounded-2xl"
            >
              <Image src="/TestLogo.png" alt="Logo" width={160} height={32} className="brightness-0 invert" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl lg:text-4xl font-black text-[#072635] mb-3 tracking-tight"
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 font-medium"
            >
              {isLogin ? "Securely login to your portal" : "Join our network of professionals"}
            </motion.p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl mb-8 relative">
            <motion.div
              className="absolute inset-y-1.5 bg-white rounded-xl shadow-sm border border-gray-200/50"
              initial={false}
              animate={{
                left: isLogin ? "0.375rem" : "50%",
                width: "calc(50% - 0.375rem)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors relative z-10 flex items-center justify-center space-x-2 ${
                isLogin ? "text-[#072635]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LogIn size={18} />
              <span>Login</span>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors relative z-10 flex items-center justify-center space-x-2 ${
                !isLogin ? "text-[#072635]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserPlus size={18} />
              <span>Signup</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="max-h-[55vh] overflow-y-auto custom-scrollbar pr-2 pb-2"
            >
              <form onSubmit={handleAuth} className="space-y-5">
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, scale: 0.9 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.9 }}
                      className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center space-x-2 overflow-hidden"
                    >
                      <Activity size={18} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, scale: 0.9 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.9 }}
                      className="p-4 bg-[#01F0D0]/10 border border-[#01F0D0]/30 text-[#072635] text-sm font-bold rounded-2xl flex items-center space-x-2 overflow-hidden"
                    >
                      <ShieldCheck size={18} className="text-[#01F0D0]" />
                      <span>{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] placeholder:text-gray-400"
                        placeholder="John"
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] placeholder:text-gray-400"
                        placeholder="Doe"
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1">Gender</label>
                      <div className="relative">
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] appearance-none"
                          required={!isLogin}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1">Date of Birth</label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] text-sm"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 group-focus-within:border-[#01F0D0]/50 transition-colors">
                      <Mail className="text-gray-400 group-focus-within:text-[#01F0D0] transition-colors" size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-14 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] placeholder:text-gray-400"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center pl-1 pr-2">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Password</label>
                    {isLogin && <button type="button" className="text-[11px] font-bold text-[#01F0D0] hover:text-[#072635] transition-colors">Forgot?</button>}
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 group-focus-within:border-[#01F0D0]/50 transition-colors">
                      <Lock className="text-gray-400 group-focus-within:text-[#01F0D0] transition-colors" size={16} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-14 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] placeholder:text-gray-400 tracking-wider"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-2 bg-[#072635] hover:bg-[#0a354a] text-white font-bold rounded-2xl shadow-xl shadow-[#072635]/20 transition-all flex items-center justify-center space-x-3 disabled:opacity-70 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? "Access Dashboard" : "Complete Setup"}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="relative my-8 flex items-center justify-center">
                <div className="absolute w-full border-t border-gray-200"></div>
                <span className="relative bg-white px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Or continue with
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full py-4 bg-white border border-gray-200 text-[#072635] font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9194 17.5885 17.2025 16.344 18.0182V21.0182H20.1803C22.433 18.9273 23.766 15.8921 23.766 12.2764Z" fill="#4285F4"/>
                  <path d="M12.24 24.0008C15.4765 24.0008 18.2059 22.9382 20.1845 21.0182L16.3482 18.0182C15.2817 18.7444 13.8841 19.1398 12.2442 19.1398C9.11746 19.1398 6.47194 17.0316 5.51897 14.1953H1.54541V17.2718C3.51897 21.2182 7.58434 24.0008 12.24 24.0008Z" fill="#34A853"/>
                  <path d="M5.51474 14.1953C5.00002 12.6591 5.00002 10.9816 5.51474 9.44534V6.36884H1.54541C-0.158371 9.82711 -0.158371 13.8136 1.54541 17.2718L5.51474 14.1953Z" fill="#FBBC04"/>
                  <path d="M12.24 4.85966C13.9514 4.83238 15.602 5.48238 16.8327 6.67151L20.2604 3.24382C18.0874 1.19655 15.2158 -0.0145805 12.24 -5.53428e-05C7.58434 -5.53428e-05 3.51897 2.78267 1.54541 6.72911L5.51897 9.80561C6.46771 6.96925 9.11322 4.85966 12.24 4.85966Z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </motion.button>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              © 2024 Coalition Technologies Healthcare
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
