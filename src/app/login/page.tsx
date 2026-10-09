"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, ArrowRight, UserPlus, LogIn, ShieldCheck, Activity, ChevronRight, Zap, Eye, EyeOff, Key } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<"form" | "otp" | "forgot" | "reset">("form");
  const [otpType, setOtpType] = useState<"signup" | "forgot">("signup");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
  const [showPassword, setShowPassword] = useState(false);
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
      if (step === "form") {
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
          const res = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, type: "signup" }),
          });
          const data = await res.json();
          if (res.ok) {
            setSuccess("OTP sent to your email!");
            setOtpType("signup");
            setStep("otp");
          } else {
            setError(data.error || "Failed to send OTP.");
          }
        }
      } else if (step === "forgot") {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type: "forgot" }),
        });
        const data = await res.json();
        if (res.ok) {
          setSuccess("OTP sent to your email!");
          setOtpType("forgot");
          setStep("otp");
        } else {
          setError(data.error || "Failed to send OTP.");
        }
      } else if (step === "otp") {
        if (otpType === "signup") {
          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, firstName, lastName, gender, dateOfBirth, otp }),
          });

          const data = await res.json();
          if (res.ok) {
            setSuccess("Account created! Please log in.");
            setTimeout(() => {
              setIsLogin(true);
              setStep("form");
              setSuccess("");
              setPassword("");
              setOtp("");
            }, 1500);
          } else {
            setError(data.error || "Failed to create account.");
          }
        } else if (otpType === "forgot") {
          setStep("reset");
          setSuccess("Please enter your new password.");
        }
      } else if (step === "reset") {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        });
        const data = await res.json();
        if (res.ok) {
          setSuccess("Password reset successfully! Please log in.");
          setTimeout(() => {
            setIsLogin(true);
            setStep("form");
            setSuccess("");
            setPassword("");
            setNewPassword("");
            setOtp("");
          }, 1500);
        } else {
          setError(data.error || "Failed to reset password.");
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
    <div className="min-h-screen flex items-center justify-center bg-[#031119] relative font-sans selection:bg-[#01F0D0] selection:text-[#072635] py-12 px-4">
      <div
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[radial-gradient(circle_at_center,rgba(1,240,208,0.15)_0%,transparent_60%)] rounded-full"
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(7,38,53,0.8)_0%,rgba(1,240,208,0.05)_40%,transparent_70%)] rounded-full"
      />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] shadow-2xl shadow-[#01F0D0]/5 overflow-hidden m-4 relative z-10 bg-white/5 backdrop-blur-xl border border-white/10">

        <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden bg-gradient-to-br from-[#072635] to-[#04151e]">
          <div className="absolute top-20 right-10 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(1,240,208,0.8)_0%,transparent_70%)] rounded-full mix-blend-overlay opacity-60" />
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.8)_0%,transparent_70%)] rounded-full mix-blend-overlay opacity-40" />

          <div className="relative z-10">
            <div className="space-y-6">
              <div>
                <h2 className="text-5xl xl:text-6xl font-black leading-[1.1] text-white">
                  Intelligent <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01F0D0] to-blue-400">
                    Healthcare
                  </span> <br/>
                  Dashboard.
                </h2>
              </div>
              <p className="text-lg text-gray-300 max-w-md font-medium leading-relaxed">
                Experience the next generation of medical data management. Seamless, secure, and blazingly fast.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
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
          </div>
        </div>

        <div className="p-8 lg:p-14 flex flex-col justify-center bg-white/95 backdrop-blur-md relative">
          <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-transparent via-[#01F0D0] to-transparent opacity-50" />

          <div className="mb-12 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-black text-[#072635] mb-2 tracking-tight leading-tight">
                {step === "otp" ? "Verify OTP" : step === "forgot" ? "Reset Password" : step === "reset" ? "New Password" : isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                {step === "otp" ? "Enter the 6-digit code sent to your email" : step === "forgot" ? "Enter your email to receive an OTP" : step === "reset" ? "Secure your account with a new password" : isLogin ? "Securely login to your portal" : "Join our network of professionals"}
              </p>
            </div>
            {step !== "form" && (
              <button
                onClick={() => { setStep("form"); setError(""); setSuccess(""); }}
                className="text-xs font-bold text-gray-400 hover:text-[#01F0D0] transition-colors whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Back
              </button>
            )}
          </div>

          {step === "form" && (
            <div className="flex p-2 bg-gray-100/80 backdrop-blur-sm rounded-2xl mb-10 relative gap-2">
              <div
                className="absolute inset-y-2 bg-white rounded-xl shadow-md border border-gray-200/50 transition-all duration-300"
                style={{
                  left: isLogin ? "0.5rem" : "calc(50% + 0.25rem)",
                  width: "calc(50% - 0.5rem)"
                }}
              />
              <button
                onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
                className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-colors relative z-10 flex items-center justify-center space-x-2 ${
                  isLogin ? "text-[#072635]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
                className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-colors relative z-10 flex items-center justify-center space-x-2 ${
                  !isLogin ? "text-[#072635]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <UserPlus size={18} />
                <span>Signup</span>
              </button>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleAuth} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 text-sm font-bold rounded-xl flex items-start space-x-2">
                  <Activity size={18} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="p-3 bg-[#01F0D0]/10 border border-[#01F0D0]/30 text-[#072635] text-sm font-bold rounded-xl flex items-start space-x-2">
                  <ShieldCheck size={18} className="text-[#01F0D0] mt-0.5 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {step === "form" && !isLogin && (
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/40 focus:border-[#01F0D0] outline-none transition-all font-medium text-[#072635] placeholder:text-gray-400"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/40 focus:border-[#01F0D0] outline-none transition-all font-medium text-[#072635] placeholder:text-gray-400"
                      placeholder="Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">Gender</label>
                    <div className="relative">
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/40 focus:border-[#01F0D0] outline-none transition-all font-medium text-[#072635] appearance-none"
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/40 focus:border-[#01F0D0] outline-none transition-all font-medium text-[#072635] text-sm"
                      required
                    />
                  </div>
                </div>
              )}

              {(step === "form" || step === "forgot") && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center shadow-sm border border-gray-200 group-focus-within:border-[#01F0D0]/50 group-focus-within:bg-white transition-all">
                      <Mail className="text-gray-400 group-focus-within:text-[#01F0D0] transition-colors" size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/40 focus:border-[#01F0D0] outline-none transition-all font-medium text-[#072635] placeholder:text-gray-400"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>
              )}

              {step === "form" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center pl-1 pr-0 gap-4">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
                    {isLogin && <button type="button" onClick={() => { setStep("forgot"); setError(""); setSuccess(""); }} className="text-xs font-bold text-[#01F0D0] hover:text-[#072635] transition-colors whitespace-nowrap">Forgot Password?</button>}
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center shadow-sm border border-gray-200 group-focus-within:border-[#01F0D0]/50 group-focus-within:bg-white transition-all">
                      <Lock className="text-gray-400 group-focus-within:text-[#01F0D0] transition-colors" size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-14 pr-12 py-3 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/40 focus:border-[#01F0D0] outline-none transition-all font-medium text-[#072635] placeholder:text-gray-400 tracking-wide"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#01F0D0] transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {step === "otp" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">One Time Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center shadow-sm border border-gray-200 group-focus-within:border-[#01F0D0]/50 group-focus-within:bg-white transition-all">
                      <Key className="text-gray-400 group-focus-within:text-[#01F0D0] transition-colors" size={16} />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/40 focus:border-[#01F0D0] outline-none transition-all font-medium text-[#072635] placeholder:text-gray-400 tracking-[0.4em] text-center"
                      placeholder="123456"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              )}

              {step === "reset" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">New Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center shadow-sm border border-gray-200 group-focus-within:border-[#01F0D0]/50 group-focus-within:bg-white transition-all">
                      <Lock className="text-gray-400 group-focus-within:text-[#01F0D0] transition-colors" size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-14 pr-12 py-3 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/40 focus:border-[#01F0D0] outline-none transition-all font-medium text-[#072635] placeholder:text-gray-400 tracking-wide"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#01F0D0] transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-3 bg-[#072635] hover:bg-[#0a354a] disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg shadow-[#072635]/20 transition-all flex items-center justify-center space-x-3 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="font-semibold">
                      {step === "otp" ? "Verify OTP"
                      : step === "forgot" ? "Send OTP"
                      : step === "reset" ? "Reset Password"
                      : isLogin ? "Access Dashboard"
                      : "Complete Setup"}
                    </span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {step === "form" && (
              <>
                <div className="relative my-8 flex items-center justify-center">
                  <div className="absolute w-full border-t border-gray-200"></div>
                  <span className="relative bg-white px-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    Or continue with
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-full py-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-[#072635] font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9194 17.5885 17.2025 16.344 18.0182V21.0182H20.1803C22.433 18.9273 23.766 15.8921 23.766 12.2764Z" fill="#4285F4"/>
                    <path d="M12.24 24.0008C15.4765 24.0008 18.2059 22.9382 20.1845 21.0182L16.3482 18.0182C15.2817 18.7444 13.8841 19.1398 12.2442 19.1398C9.11746 19.1398 6.47194 17.0316 5.51897 14.1953H1.54541V17.2718C3.51897 21.2182 7.58434 24.0008 12.24 24.0008Z" fill="#34A853"/>
                    <path d="M5.51474 14.1953C5.00002 12.6591 5.00002 10.9816 5.51474 9.44534V6.36884H1.54541C-0.158371 9.82711 -0.158371 13.8136 1.54541 17.2718L5.51474 14.1953Z" fill="#FBBC04"/>
                    <path d="M12.24 4.85966C13.9514 4.83238 15.602 5.48238 16.8327 6.67151L20.2604 3.24382C18.0874 1.19655 15.2158 -0.0145805 12.24 -5.53428e-05C7.58434 -5.53428e-05 3.51897 2.78267 1.54541 6.72911L5.51897 9.80561C6.46771 6.96925 9.11322 4.85966 12.24 4.85966Z" fill="#EA4335"/>
                  </svg>
                  <span className="font-semibold">Continue with Google</span>
                </button>
              </>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200 text-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              © 2024 Coalition Technologies Healthcare
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}