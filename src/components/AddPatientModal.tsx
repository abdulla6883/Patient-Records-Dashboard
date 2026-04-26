"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Heart, Activity, Thermometer, Wind, Plus, Save } from 'lucide-react';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => Promise<void>;
}

export default function AddPatientModal({ isOpen, onClose, onAdd }: AddPatientModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Female',
    systolic: '120',
    diastolic: '80',
    heartRate: '72',
    respiratoryRate: '16',
    temperature: '98.6',
    diagnostic: 'Healthy',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      diagnosisHistory: [
        {
          month: 'March',
          year: 2024,
          systolicValue: parseInt(formData.systolic),
          systolicLevel: parseInt(formData.systolic) > 130 ? 'Higher than Average' : 'Normal',
          diastolicValue: parseInt(formData.diastolic),
          diastolicLevel: parseInt(formData.diastolic) > 85 ? 'Higher than Average' : 'Normal',
          heartRateValue: parseInt(formData.heartRate),
          heartRateLevel: 'Normal',
          respiratoryValue: parseInt(formData.respiratoryRate),
          respiratoryLevel: 'Normal',
          temperatureValue: parseFloat(formData.temperature),
          temperatureLevel: 'Normal',
        }
      ],
      diagnosticList: [
        { name: formData.diagnostic, description: 'Initial screening', status: 'Active' }
      ]
    };

    await onAdd(payload);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[10000] flex flex-col max-h-[90vh] border border-[#EDEDED]"
          >
            {/* Header - Fixed & Solid */}
            <div className="p-5 lg:p-6 border-b border-[#F6F7F8] flex items-center justify-between shrink-0 bg-white rounded-t-3xl">
              <div>
                <h2 className="text-xl lg:text-2xl font-black text-[#072635]">Add New Patient</h2>
                <p className="text-[#707070] text-xs lg:text-sm">Enter clinical details for the new record</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-[#707070]" />
              </button>
            </div>

            {/* Content - Scrollable & Solid */}
            <div className="p-5 lg:p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <form id="add-patient-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] lg:text-xs font-bold text-[#072635] uppercase tracking-wider mb-1.5 block ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707070]" size={16} />
                      <input 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 bg-[#F6F7F8] border-none rounded-xl focus:ring-2 focus:ring-[#01F0D0] transition-all outline-none text-[#072635] font-semibold text-sm"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] lg:text-xs font-bold text-[#072635] uppercase tracking-wider mb-1.5 block ml-1">Age</label>
                    <input 
                      required
                      type="number"
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                      className="w-full px-4 py-3 bg-[#F6F7F8] border-none rounded-xl focus:ring-2 focus:ring-[#01F0D0] transition-all outline-none text-[#072635] font-semibold text-sm"
                      placeholder="e.g. 35"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] lg:text-xs font-bold text-[#072635] uppercase tracking-wider mb-1.5 block ml-1">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-4 py-3 bg-[#F6F7F8] border-none rounded-xl focus:ring-2 focus:ring-[#01F0D0] transition-all outline-none text-[#072635] font-semibold text-sm appearance-none"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Health Factors - Compact Grid */}
                <div className="bg-[#F6F7F8] p-4 lg:p-5 rounded-2xl space-y-3">
                  <h3 className="text-xs lg:text-sm font-black text-[#072635] flex items-center">
                    <Activity className="mr-2 text-[#01F0D0]" size={16} />
                    Clinical Health Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div>
                      <label className="text-[9px] lg:text-[10px] font-bold text-[#707070] uppercase mb-1 block ml-1">BP (Systolic)</label>
                      <input 
                        type="number"
                        value={formData.systolic}
                        onChange={e => setFormData({...formData, systolic: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-[#EDEDED] rounded-lg focus:ring-2 focus:ring-[#01F0D0] outline-none text-[#072635] font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] lg:text-[10px] font-bold text-[#707070] uppercase mb-1 block ml-1">BP (Diastolic)</label>
                      <input 
                        type="number"
                        value={formData.diastolic}
                        onChange={e => setFormData({...formData, diastolic: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-[#EDEDED] rounded-lg focus:ring-2 focus:ring-[#01F0D0] outline-none text-[#072635] font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] lg:text-[10px] font-bold text-[#707070] uppercase mb-1 block ml-1">Heart Rate</label>
                      <input 
                        type="number"
                        value={formData.heartRate}
                        onChange={e => setFormData({...formData, heartRate: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-[#EDEDED] rounded-lg focus:ring-2 focus:ring-[#01F0D0] outline-none text-[#072635] font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] lg:text-[10px] font-bold text-[#707070] uppercase mb-1 block ml-1">Temp (°F)</label>
                      <input 
                        step="0.1"
                        type="number"
                        value={formData.temperature}
                        onChange={e => setFormData({...formData, temperature: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-[#EDEDED] rounded-lg focus:ring-2 focus:ring-[#01F0D0] outline-none text-[#072635] font-bold text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] lg:text-[10px] font-bold text-[#707070] uppercase mb-1 block ml-1">Primary Diagnosis</label>
                      <input 
                        value={formData.diagnostic}
                        onChange={e => setFormData({...formData, diagnostic: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-[#EDEDED] rounded-lg focus:ring-2 focus:ring-[#01F0D0] outline-none text-[#072635] font-bold text-sm"
                        placeholder="e.g. Hypertension"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer - Fixed & Solid */}
            <div className="p-5 lg:p-6 border-t border-[#F6F7F8] shrink-0 bg-white rounded-b-3xl">
              <button
                form="add-patient-form"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 lg:py-4 bg-[#01F0D0] text-[#072635] font-black rounded-xl hover:bg-[#01d9bc] shadow-lg shadow-[#01F0D0]/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-[#072635]/20 border-t-[#072635] rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Create Patient Profile</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
