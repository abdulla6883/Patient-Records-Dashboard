"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2, User, Activity, ShieldCheck, ChevronRight, Camera } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { update } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user/settings');
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.success && data.user) {
          setFirstName(data.user.firstName || "");
          setLastName(data.user.lastName || "");
          setGender(data.user.gender || "Male");
          setDateOfBirth(data.user.dateOfBirth || "");
          if (data.user.image) {
            setImagePreview(data.user.image);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, gender, dateOfBirth, image: imageBase64 }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Profile updated successfully!");
        if (imageBase64) {
          update({ image: data.user.image, name: data.user.name });
        } else {
          update({ name: data.user.name });
        }
      } else {
        setError(data.error || "Failed to update profile.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    
    setDeleting(true);
    setError("");
    try {
      const res = await fetch('/api/user/settings', {
        method: 'DELETE',
      });
      if (res.ok) {
        // Sign out and redirect
        signOut({ callbackUrl: '/login' });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete account.");
        setDeleting(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#01F0D0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#072635] mb-2 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 font-medium">Manage your profile details and account preferences.</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center space-x-2 font-bold"
          >
            <Activity size={18} />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-[#01F0D0]/10 text-[#072635] border border-[#01F0D0]/30 rounded-2xl flex items-center space-x-2 font-bold"
          >
            <ShieldCheck size={18} className="text-[#01F0D0]" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-10 mb-8">
        <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-100">
          <div className="relative group">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden relative border-2 border-gray-200">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={gender.toLowerCase() === "female" ? "/images/avatar-female.svg" : "/images/avatar-male.svg"} 
                  alt="Default Profile" 
                  className="w-full h-full object-cover p-2" 
                />
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-2xl">
                <Camera size={20} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#072635]">Personal Information</h2>
            <p className="text-sm text-gray-500">Update your basic profile details and profile picture.</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635]"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635]"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Gender</label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] appearance-none"
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
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635]"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-[#01F0D0] hover:bg-[#01d6ba] text-[#072635] font-black rounded-2xl transition-colors shadow-lg shadow-[#01F0D0]/20 flex items-center space-x-2 disabled:opacity-70"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-[#072635]/30 border-t-[#072635] rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-red-50/50 rounded-3xl border border-red-100 p-6 lg:p-10">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <h2 className="text-xl font-bold text-red-600 mb-1">Danger Zone</h2>
            <p className="text-sm text-red-500/80 font-medium max-w-md">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-6 py-3 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white font-bold rounded-xl transition-all flex items-center space-x-2 disabled:opacity-70 group"
          >
            {deleting ? (
              <div className="w-5 h-5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin group-hover:border-white/30 group-hover:border-t-white" />
            ) : (
              <Trash2 size={18} />
            )}
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
