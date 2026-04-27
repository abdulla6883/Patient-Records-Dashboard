"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, UserPlus, LogIn, ShieldCheck, Activity } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // Login Logic
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password. Please try again.");
        } else {
          setSuccess("Welcome back! Redirecting...");
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 1000);
        }
      } else {
        // Signup Logic
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccess("Account created successfully! You can now login.");
          setIsLogin(true);
          setPassword(""); // Clear password but keep email for login
        } else {
          setError(data.error || "Failed to create account.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F7F8] relative overflow-hidden font-sans">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#01F0D0]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#072635]/5 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden m-4 relative z-10 border border-white/20">
        
        {/* Left Side: Visual / Brand */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-[#072635] text-white relative">
          <div className="relative z-10">
            <Image src="/TestLogo.png" alt="Coalition Technologies" width={180} height={36} className="brightness-0 invert mb-16" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-4xl xl:text-5xl font-black leading-tight">
                Empowering <span className="text-[#01F0D0]">Healthcare</span> Through Data.
              </h2>
              <p className="text-lg text-gray-400 max-w-md font-medium">
                Access your medical dashboard, manage patient records, and analyze clinical trends with our state-of-the-art health portal.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#01F0D0]/20 flex items-center justify-center text-[#01F0D0]">
                <ShieldCheck size={24} />
              </div>
              <span className="text-sm font-bold">Secure Access</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#01F0D0]/20 flex items-center justify-center text-[#01F0D0]">
                <Activity size={24} />
              </div>
              <span className="text-sm font-bold">Live Metrics</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#01F0D0]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <Image src="/TestLogo.png" alt="Logo" width={160} height={32} />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-[#072635] mb-3">
              {isLogin ? "Welcome Back" : "Join the Portal"}
            </h1>
            <p className="text-[#707070] font-medium">
              {isLogin ? "Enter your credentials to access your account" : "Create a new professional account to get started"}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-[#F6F7F8] rounded-2xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                isLogin ? "bg-white text-[#072635] shadow-sm" : "text-[#707070] hover:text-[#072635]"
              }`}
            >
              <LogIn size={18} />
              <span>Login</span>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                !isLogin ? "bg-white text-[#072635] shadow-sm" : "text-[#707070] hover:text-[#072635]"
              }`}
            >
              <UserPlus size={18} />
              <span>Signup</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleAuth} className="space-y-6">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-bold rounded-r-xl"
                  >
                    {success}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#072635] uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#01F0D0] transition-colors" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-[#F6F7F8] border-none rounded-2xl focus:ring-2 focus:ring-[#01F0D0] outline-none transition-all font-semibold text-[#072635]"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-black text-[#072635] uppercase tracking-widest">Password</label>
                    {isLogin && <button type="button" className="text-[10px] font-bold text-[#01F0D0] hover:underline uppercase tracking-widest">Forgot?</button>}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#01F0D0] transition-colors" size={20} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-[#F6F7F8] border-none rounded-2xl focus:ring-2 focus:ring-[#01F0D0] outline-none transition-all font-semibold text-[#072635]"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-[#01F0D0] text-[#072635] font-black rounded-2xl hover:bg-[#01d9bc] shadow-lg shadow-[#01F0D0]/20 transition-all flex items-center justify-center space-x-3 transform active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-[#072635]/20 border-t-[#072635] rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? "Sign In to Dashboard" : "Create Account"}</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-[#F6F7F8] text-center">
            <p className="text-xs font-bold text-[#707070] uppercase tracking-widest">
              © 2024 Coalition Technologies Healthcare
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

